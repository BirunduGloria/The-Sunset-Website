import { useEffect, useState } from "react";
import { adminLogin, fetchAdminBookings } from "./api";

const AUTH_KEY = "sunset_admin_token";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function LoginForm({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await adminLogin(password);
      sessionStorage.setItem(AUTH_KEY, password);
      onLogin(password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
        <p className="text-gray-500 mb-8">The Sunset — Bookings Dashboard</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <a
          href="/"
          className="block text-center mt-6 text-gray-500 hover:text-orange-500"
        >
          ← Back to website
        </a>
      </div>
    </div>
  );
}

function BookingsTable({ bookings }) {
  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow p-12 text-center text-gray-500">
        No bookings yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-4 py-4 text-sm font-semibold">Booking #</th>
              <th className="px-4 py-4 text-sm font-semibold">Guest</th>
              <th className="px-4 py-4 text-sm font-semibold">Contact</th>
              <th className="px-4 py-4 text-sm font-semibold">Room</th>
              <th className="px-4 py-4 text-sm font-semibold">Check-in</th>
              <th className="px-4 py-4 text-sm font-semibold">Check-out</th>
              <th className="px-4 py-4 text-sm font-semibold">Nights</th>
              <th className="px-4 py-4 text-sm font-semibold">Guests</th>
              <th className="px-4 py-4 text-sm font-semibold">Total</th>
              <th className="px-4 py-4 text-sm font-semibold">Booked</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking.bookingNumber}
                className="border-b border-gray-100 hover:bg-orange-50"
              >
                <td className="px-4 py-4 font-mono text-sm font-semibold text-orange-600">
                  {booking.bookingNumber}
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium">{booking.guestName}</div>
                  <div className="text-sm text-gray-500">{booking.guestCountry}</div>
                </td>
                <td className="px-4 py-4 text-sm">
                  <div>{booking.guestEmail}</div>
                  <div className="text-gray-500">{booking.guestPhone}</div>
                </td>
                <td className="px-4 py-4">
                  <div>{booking.roomName}</div>
                  <div className="text-sm text-gray-500">
                    {formatCurrency(booking.roomPrice)}/night
                  </div>
                </td>
                <td className="px-4 py-4 text-sm">{formatDate(booking.checkin)}</td>
                <td className="px-4 py-4 text-sm">{formatDate(booking.checkout)}</td>
                <td className="px-4 py-4 text-sm text-center">{booking.nights}</td>
                <td className="px-4 py-4 text-sm text-center">{booking.guests}</td>
                <td className="px-4 py-4 font-semibold">
                  {formatCurrency(booking.total)}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {formatDate(booking.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminDashboard({ token, onLogout }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadBookings() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchAdminBookings(token);
        if (!cancelled) {
          setBookings(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBookings();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const refreshBookings = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchAdminBookings(token);
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = bookings.reduce(
    (sum, booking) => sum + Number(booking.total),
    0
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-900 text-white px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">The Sunset Admin</h1>
            <p className="text-gray-400 text-sm">Bookings dashboard</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={refreshBookings}
              className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 font-medium"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-800"
            >
              Logout
            </button>
            <a
              href="/"
              className="text-gray-400 hover:text-white"
            >
              View site
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">Total Bookings</p>
            <p className="text-4xl font-bold text-gray-900 mt-1">
              {bookings.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <p className="text-4xl font-bold text-orange-500 mt-1">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">Latest Booking</p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {bookings[0]?.bookingNumber || "—"}
            </p>
          </div>
        </div>

        {loading && (
          <p className="text-center text-gray-500 py-12">Loading bookings...</p>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {!loading && !error && <BookingsTable bookings={bookings} />}
      </main>
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState(
    () => sessionStorage.getItem(AUTH_KEY) || ""
  );

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setToken("");
  };

  if (!token) {
    return <LoginForm onLogin={setToken} />;
  }

  return <AdminDashboard token={token} onLogout={handleLogout} />;
}
