import { Router } from "express";
import { findRoomByPrice } from "../data/rooms.js";
import {
  createBooking as saveBooking,
  getBookingByNumber,
} from "../data/store.js";

const router = Router();

function generateBookingNumber() {
  return "SUN-" + Math.floor(100000 + Math.random() * 900000);
}

function calculateBookingDetails({ checkin, checkout, roomPrice, guests }) {
  const room = findRoomByPrice(roomPrice);

  if (!room) {
    return { error: "Invalid room selection." };
  }

  if (!checkin || !checkout) {
    return { error: "Check-in and check-out dates are required." };
  }

  if (checkout <= checkin) {
    return { error: "Check-out date must be after check-in." };
  }

  const checkinDate = new Date(checkin);
  const checkoutDate = new Date(checkout);
  const nights =
    (checkoutDate - checkinDate) / (1000 * 60 * 60 * 24);
  const total = nights * room.price;

  return {
    roomName: room.name,
    roomPrice: room.price,
    checkin,
    checkout,
    nights,
    total,
    guests: Number(guests) || 1,
  };
}

router.post("/preview", (req, res) => {
  const result = calculateBookingDetails(req.body);

  if (result.error) {
    return res.status(400).json({ message: result.error });
  }

  return res.json(result);
});

router.post("/", async (req, res) => {
  const {
    checkin,
    checkout,
    roomPrice,
    guests,
    guestName,
    guestEmail,
    guestPhone,
    guestCountry,
  } = req.body;

  const bookingDetails = calculateBookingDetails({
    checkin,
    checkout,
    roomPrice,
    guests,
  });

  if (bookingDetails.error) {
    return res.status(400).json({ message: bookingDetails.error });
  }

  if (!guestName || !guestEmail || !guestPhone || !guestCountry) {
    return res.status(400).json({
      message: "Please complete all guest information.",
    });
  }

  const bookingNumber = generateBookingNumber();

  const booking = {
    bookingNumber,
    guestName,
    guestEmail,
    guestPhone,
    guestCountry,
    ...bookingDetails,
    createdAt: new Date().toISOString(),
  };

  await saveBooking(booking);

  return res.status(201).json({
    bookingNumber,
    guestName,
    roomName: booking.roomName,
    checkin: booking.checkin,
    checkout: booking.checkout,
    guests: booking.guests,
    total: booking.total,
    nights: booking.nights,
    roomPrice: booking.roomPrice,
  });
});

router.get("/:bookingNumber", async (req, res) => {
  const booking = await getBookingByNumber(req.params.bookingNumber);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found." });
  }

  return res.json(booking);
});

export default router;
