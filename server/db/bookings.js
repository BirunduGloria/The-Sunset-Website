import pool from "./pool.js";

function rowToBooking(row) {
  return {
    bookingNumber: row.booking_number,
    guestName: row.guest_name,
    guestEmail: row.guest_email,
    guestPhone: row.guest_phone,
    guestCountry: row.guest_country,
    roomName: row.room_name,
    roomPrice: Number(row.room_price),
    checkin: formatDate(row.checkin),
    checkout: formatDate(row.checkout),
    nights: row.nights,
    total: Number(row.total),
    guests: row.guests,
    createdAt: row.created_at.toISOString(),
  };
}

function formatDate(value) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value).slice(0, 10);
}

export async function countOverlappingBookings(roomPrice, checkin, checkout) {
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS count FROM bookings
     WHERE room_price = $1
       AND checkin < $3
       AND checkout > $2`,
    [Number(roomPrice), checkin, checkout]
  );

  return rows[0].count;
}

export async function getAllBookings() {
  const { rows } = await pool.query(
    "SELECT * FROM bookings ORDER BY created_at DESC"
  );

  return rows.map(rowToBooking);
}

export async function getBookingByNumber(bookingNumber) {
  const { rows } = await pool.query(
    "SELECT * FROM bookings WHERE booking_number = $1",
    [bookingNumber]
  );

  return rows[0] ? rowToBooking(rows[0]) : null;
}

export async function createBooking(booking) {
  const { rows } = await pool.query(
    `INSERT INTO bookings (
      booking_number, guest_name, guest_email, guest_phone, guest_country,
      room_name, room_price, checkin, checkout, nights, total, guests, created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *`,
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

  return rowToBooking(rows[0]);
}
