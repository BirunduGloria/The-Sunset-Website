import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");

async function ensureBookingsFile() {
  await mkdir(DATA_DIR, { recursive: true });

  try {
    await readFile(BOOKINGS_FILE, "utf-8");
  } catch {
    await writeFile(BOOKINGS_FILE, "[]", "utf-8");
  }
}

async function readBookings() {
  await ensureBookingsFile();
  const raw = await readFile(BOOKINGS_FILE, "utf-8");
  return JSON.parse(raw);
}

async function writeBookings(bookings) {
  await ensureBookingsFile();
  await writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf-8");
}

export async function getAllBookings() {
  return readBookings();
}

export async function getBookingByNumber(bookingNumber) {
  const bookings = await readBookings();
  return bookings.find((booking) => booking.bookingNumber === bookingNumber);
}

export async function createBooking(booking) {
  const bookings = await readBookings();
  bookings.push(booking);
  await writeBookings(bookings);
  return booking;
}
