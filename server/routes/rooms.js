import { Router } from "express";
import { ROOMS } from "../data/rooms.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json(
    ROOMS.map((room) => ({
      ...room,
      price: String(room.price),
    }))
  );
});

export default router;
