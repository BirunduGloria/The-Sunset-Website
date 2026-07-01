import pool from "./pool.js";

export async function createUser({
  fullName,
  email,
  passwordHash,
  verificationToken,
}) {
  const { rows } = await pool.query(
    `
    INSERT INTO users
    (
      full_name,
      email,
      password_hash,
      verification_token
    )
    VALUES ($1,$2,$3,$4)
    RETURNING *
    `,
    [
      fullName,
      email,
      passwordHash,
      verificationToken,
    ]
  );

  return rows[0];
}

export async function findUserByEmail(email) {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM users
    WHERE email=$1
    `,
    [email]
  );

  return rows[0];
}

export async function findUserById(id) {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM users
    WHERE id=$1
    `,
    [id]
  );

  return rows[0];
}

export async function verifyUser(token) {
  const { rows } = await pool.query(
    `
    UPDATE users
    SET
      email_verified=true,
      verification_token=NULL
    WHERE verification_token=$1
    RETURNING *
    `,
    [token]
  );

  return rows[0];
}

export async function saveResetToken(
  email,
  token,
  expiry
) {
  const { rows } = await pool.query(
    `
    UPDATE users
    SET
      reset_token=$1,
      reset_token_expiry=$2
    WHERE email=$3
    RETURNING *
    `,
    [
      token,
      expiry,
      email,
    ]
  );

  return rows[0];
}

export async function findUserByResetToken(token) {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM users
    WHERE reset_token=$1
    `,
    [token]
  );

  return rows[0];
}

export async function updatePassword(
  id,
  passwordHash
) {
  const { rows } = await pool.query(
    `
    UPDATE users
    SET
      password_hash=$1,
      reset_token=NULL,
      reset_token_expiry=NULL
    WHERE id=$2
    RETURNING *
    `,
    [
      passwordHash,
      id,
    ]
  );

  return rows[0];
}