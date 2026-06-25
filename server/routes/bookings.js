import { Router } from "express";
import { findRoomByPrice } from "../data/rooms.js";
import {
  countOverlappingBookings,
  createBooking as saveBooking,
  getBookingByNumber,
} from "../db/bookings.js";

const router = Router();

function generateBookingNumber() {
  return "SUN-" + Math.floor(100000 + Math.random() * 900000);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

async function calculateBookingDetails({ checkin, checkout, roomPrice, guests }) {
  const room = findRoomByPrice(roomPrice);

  if (!room) {
    return { error: "Invalid room selection." };
  }

  if (!checkin || !checkout) {
    return { error: "Check-in and check-out dates are required." };
  }

  if (checkin < todayString()) {
    return { error: "Check-in date cannot be in the past." };
  }

  if (checkout <= checkin) {
    return { error: "Check-out date must be after check-in." };
  }

  const checkinDate = new Date(`${checkin}T00:00:00`);
  const checkoutDate = new Date(`${checkout}T00:00:00`);
  const nights =
    (checkoutDate - checkinDate) / (1000 * 60 * 60 * 24);

  if (nights < 1) {
    return { error: "Booking must be at least one night." };
  }

  const overlapping = await countOverlappingBookings(
    room.price,
    checkin,
    checkout
  );

  if (overlapping >= room.inventory) {
    return {
      error: `${room.name} is fully booked for these dates. Please choose different dates.`,
    };
  }

  const total = nights * room.price;

  return {
    roomName: room.name,
    roomPrice: room.price,
    checkin,
    checkout,
    nights,
    total,
    guests: Number(guests) || 1,
    available: room.inventory - overlapping,
  };
}

router.post("/preview", async (req, res) => {
  try {
    const result = await calculateBookingDetails(req.body);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.json(result);
  } catch (error) {
    console.error("Preview booking failed:", error);
    return res.status(500).json({ message: "Unable to preview booking." });
  }
});

router.post("/", async (req, res) => {
  try {
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

    const bookingDetails = await calculateBookingDetails({
      checkin,
      checkout,
      roomPrice,
      guests,
    });

    if (bookingDetails.error) {
      return res.status(400).json({ message: bookingDetails.error });
    }

    if (!guestName?.trim() || !guestEmail?.trim() || !guestPhone?.trim() || !guestCountry?.trim()) {
      return res.status(400).json({
        message: "Please complete all guest information.",
      });
    }

    if (!isValidEmail(guestEmail)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    const bookingNumber = generateBookingNumber();

    const booking = {
      bookingNumber,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      guestPhone: guestPhone.trim(),
      guestCountry: guestCountry.trim(),
      ...bookingDetails,
      createdAt: new Date().toISOString(),
    };

    await saveBooking(booking);

    return res.status(201).json({
      bookingNumber,
      guestName: booking.guestName,
      roomName: booking.roomName,
      checkin: booking.checkin,
      checkout: booking.checkout,
      guests: booking.guests,
      total: booking.total,
      nights: booking.nights,
      roomPrice: booking.roomPrice,
    });
  } catch (error) {
    console.error("Create booking failed:", error);
    return res.status(500).json({ message: "Failed to create booking." });
  }
});

router.get("/:bookingNumber", async (req, res) => {
  try {
    const booking = await getBookingByNumber(req.params.bookingNumber);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    return res.json(booking);
  } catch (error) {
    console.error("Fetch booking failed:", error);
    return res.status(500).json({ message: "Unable to load booking." });
  }
});

export default router;
