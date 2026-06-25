$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$DataDir = Join-Path $ProjectRoot ".postgres-data"
$LogFile = Join-Path $ProjectRoot ".postgres.log"
$Port = 5435
$User = "postgres"
$Password = "postgres"
$Database = "sunset_hotel"

function Find-PgBin {
  $candidates = @(
    "C:\Program Files\PostgreSQL\18\bin",
    "C:\Program Files\PostgreSQL\15\bin"
  )

  foreach ($path in $candidates) {
    if (Test-Path (Join-Path $path "initdb.exe")) {
      return $path
    }
  }

  throw "PostgreSQL binaries not found. Install PostgreSQL 15+ or use Docker."
}

$PgBin = Find-PgBin
$env:Path = "$PgBin;$env:Path"

Write-Host "Ensuring local PostgreSQL data directory..."
if (-not (Test-Path $DataDir)) {
  $pwFile = New-TemporaryFile
  Set-Content -Path $pwFile -Value $Password -NoNewline
  & "$PgBin\initdb.exe" -D $DataDir -U $User -A scram-sha-256 -E UTF8 --pwfile=$pwFile
  Remove-Item $pwFile -Force

  if ($LASTEXITCODE -ne 0) {
    throw "initdb failed with exit code $LASTEXITCODE"
  }
}

$confPath = Join-Path $DataDir "postgresql.conf"
$conf = Get-Content $confPath -Raw
if ($conf -match "port = \d+") {
  $conf = $conf -replace "port = \d+", "port = $Port"
} else {
  $conf += "`nport = $Port`n"
}
Set-Content -Path $confPath -Value $conf -NoNewline

$pgReady = $false
& "$PgBin\pg_isready.exe" -h 127.0.0.1 -p $Port -U $User 2>$null | Out-Null
if ($LASTEXITCODE -eq 0) {
  $pgReady = $true
}

if (-not $pgReady) {
  Write-Host "Starting local PostgreSQL on port $Port..."
  & "$PgBin\pg_ctl.exe" start -D $DataDir -l $LogFile -o "-p $Port"

  if ($LASTEXITCODE -ne 0) {
    throw "pg_ctl start failed. Check $LogFile"
  }

  for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep -Seconds 1
    & "$PgBin\pg_isready.exe" -h 127.0.0.1 -p $Port -U $User 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) {
      $pgReady = $true
      break
    }
  }
}

if (-not $pgReady) {
  throw "Local PostgreSQL failed to start. Check $LogFile"
}

Write-Host "Creating database if needed..."
$env:PGPASSWORD = $Password
$dbExists = & "$PgBin\psql.exe" -h 127.0.0.1 -p $Port -U $User -d postgres -tAc `
  "SELECT 1 FROM pg_database WHERE datname = '$Database'" 2>$null

if (-not $dbExists -or $dbExists.Trim() -ne "1") {
  & "$PgBin\createdb.exe" -h 127.0.0.1 -p $Port -U $User $Database
}

Write-Host "Writing .env..."
$env:DATABASE_URL = "postgresql://${User}:${Password}@127.0.0.1:${Port}/${Database}"
node (Join-Path $ProjectRoot "scripts\write-env.mjs")

Write-Host "PostgreSQL ready on port $Port"
