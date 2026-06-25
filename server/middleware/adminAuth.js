export function adminAuth(req, res, next) {
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : "";

  if (token !== adminPassword) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  return next();
}
