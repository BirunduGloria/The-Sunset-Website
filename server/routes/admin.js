import { Router } from "express";
import { getAllBookings } from "../db/bookings.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();

router.post("/login", (req, res) => {
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const { password } = req.body;

  if (password !== adminPassword) {
    return res.status(401).json({ message: "Invalid password." });
  }

  return res.json({ ok: true });
});

router.get("/bookings", adminAuth, async (_req, res) => {
  try {
    const bookings = await getAllBookings();
    return res.json(bookings);
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return res.status(500).json({ message: "Failed to load bookings." });
  }
});

export default router;
