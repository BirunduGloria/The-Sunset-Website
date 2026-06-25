const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function parseResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

export async function fetchRooms() {
  const response = await fetch(`${API_BASE}/rooms`);
  return parseResponse(response);
}

export async function previewBooking(payload) {
  const response = await fetch(`${API_BASE}/bookings/preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function createBooking(payload) {
  const response = await fetch(`${API_BASE}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function fetchBooking(bookingNumber) {
  const response = await fetch(`${API_BASE}/bookings/${bookingNumber}`);
  return parseResponse(response);
}

export async function adminLogin(password) {
  const response = await fetch(`${API_BASE}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  return parseResponse(response);
}

export async function fetchAdminBookings(token) {
  const response = await fetch(`${API_BASE}/admin/bookings`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return parseResponse(response);
}
