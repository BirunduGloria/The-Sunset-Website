import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@127.0.0.1:5435/sunset_hotel";

const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
const port = process.env.PORT || "3001";

const envContent = `DATABASE_URL=${databaseUrl}
ADMIN_PASSWORD=${adminPassword}
PORT=${port}
`;

writeFileSync(path.join(root, ".env"), envContent, "utf-8");
console.log("Updated .env");
console.log(`DATABASE_URL=${databaseUrl}`);
