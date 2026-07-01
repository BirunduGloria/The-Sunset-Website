import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pool from "./pool.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      booking_number VARCHAR(20) UNIQUE NOT NULL,
      guest_name VARCHAR(255) NOT NULL,
      guest_email VARCHAR(255) NOT NULL,
      guest_phone VARCHAR(50) NOT NULL,
      guest_country VARCHAR(100) NOT NULL,
      room_name VARCHAR(100) NOT NULL,
      room_price INTEGER NOT NULL,
      checkin DATE NOT NULL,
      checkout DATE NOT NULL,
      nights INTEGER NOT NULL,
      total NUMERIC(10, 2) NOT NULL,
      guests INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      email_verified BOOLEAN DEFAULT FALSE,
      verification_token TEXT,
      reset_token TEXT,
      reset_token_expiry TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await migrateFromJsonIfEmpty();
}

async function migrateFromJsonIfEmpty() {
  const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM bookings");

  if (rows[0].count > 0) {
    return;
  }

  const jsonPath = path.join(__dirname, "..", "data", "bookings.json");

  try {
    const raw = await readFile(jsonPath, "utf-8");
    const bookings = JSON.parse(raw);

    for (const booking of bookings) {
      await pool.query(
        `INSERT INTO bookings (
          booking_number, guest_name, guest_email, guest_phone, guest_country,
          room_name, room_price, checkin, checkout, nights, total, guests, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (booking_number) DO NOTHING`,
        [
          booking.bookingNumber,
          booking.guestName,
          booking.guestEmail,
          booking.guestPhone,
          booking.guestCountry,
          booking.roomName,
          booking.roomPrice,
          booking.checkin,
          booking.checkout,
          booking.nights,
          booking.total,
          booking.guests,
          booking.createdAt || new Date().toISOString(),
        ]
      );
    }

    if (bookings.length > 0) {
      console.log(`Migrated ${bookings.length} booking(s) from bookings.json`);
    }
  } catch {
    // No legacy JSON file — fresh database is fine.
  }
}
