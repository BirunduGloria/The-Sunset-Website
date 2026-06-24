import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bookingsRouter from "./routes/bookings.js";
import roomsRouter from "./routes/rooms.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/rooms", roomsRouter);
app.use("/api/bookings", bookingsRouter);

const distPath = path.join(__dirname, "..", "dist");

app.use(express.static(distPath));

app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api")) {
    return next();
  }

  res.sendFile(path.join(distPath, "index.html"), (error) => {
    if (error) {
      next();
    }
  });
});

app.use((_req, res) => {
  res.status(404).json({ message: "Not found." });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
