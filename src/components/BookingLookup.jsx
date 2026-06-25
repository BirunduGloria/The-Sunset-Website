import { useState } from "react";
import { fetchBooking } from "../api";
import { formatCurrency, formatDisplayDate } from "../utils/dates";

export default function BookingLookup() {
  const [bookingNumber, setBookingNumber] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLookup = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);

    const trimmed = bookingNumber.trim().toUpperCase();
    if (!trimmed) {
      setError("Enter your booking number.");
      return;
    }

    setLoading(true);

    try {
      const booking = await fetchBooking(trimmed);
      setResult(booking);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="lookup" className="py-20 bg-gray-900 text-white px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-3">Find My Booking</h2>
        <p className="text-gray-400 text-center mb-8">
          Enter your booking number to view reservation details.
        </p>

        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="e.g. SUN-621065"
            value={bookingNumber}
            onChange={(event) => setBookingNumber(event.target.value)}
            className="flex-1 p-4 rounded-lg text-gray-900"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 px-8 py-4 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-60"
          >
            {loading ? "Searching..." : "Look Up"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-red-400 text-center">{error}</p>
        )}

        {result && (
          <div className="mt-8 bg-white text-gray-900 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-orange-500 mb-4">
              {result.bookingNumber}
            </h3>
            <div className="space-y-2 text-lg">
              <p><strong>Guest:</strong> {result.guestName}</p>
              <p><strong>Room:</strong> {result.roomName}</p>
              <p><strong>Check-in:</strong> {formatDisplayDate(result.checkin)}</p>
              <p><strong>Check-out:</strong> {formatDisplayDate(result.checkout)}</p>
              <p><strong>Nights:</strong> {result.nights}</p>
              <p><strong>Guests:</strong> {result.guests}</p>
              <p><strong>Total:</strong> {formatCurrency(result.total)}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
