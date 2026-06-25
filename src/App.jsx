import { useCallback, useEffect, useRef, useState } from "react";
import { createBooking, fetchRooms, previewBooking } from "./api";
import BookingLookup from "./components/BookingLookup.jsx";
import { formatCurrency, formatDisplayDate, todayString } from "./utils/dates";

const FALLBACK_ROOMS = [
  {
    name: "Standard Room",
    price: "100",
    image: "/images/pexels-didsss.jpg",
    description:
      "A cozy and affordable room perfect for solo travelers or short stays.",
  },
  {
    name: "Deluxe Room",
    price: "180",
    image: "/images/polinaunsplash.jpg",
    description:
      "A spacious room designed for comfort and relaxation. Ideal for couples and business travelers seeking a premium stay.",
  },
  {
    name: "Ocean Suite",
    price: "250",
    image: "/images/pexels-andreaedavis-30018003.jpg",
    description:
      "Experience luxury with breathtaking ocean views, elegant interiors, and premium amenities crafted for unforgettable stays.",
  },
];

function App() {
  const bookingSectionRef = useRef(null);
  const guestInfoSectionRef = useRef(null);
  const confirmationSectionRef = useRef(null);

  const [rooms, setRooms] = useState(FALLBACK_ROOMS);

  const [showBookingSection, setShowBookingSection] = useState(false);
  const [showGuestInfoSection, setShowGuestInfoSection] = useState(false);
  const [showConfirmationSection, setShowConfirmationSection] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  const [guests, setGuests] = useState(1);
  const [bookingData, setBookingData] = useState({});

  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [room, setRoom] = useState("");

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestCountry, setGuestCountry] = useState("");

  const [confirmation, setConfirmation] = useState({
    bookingNumber: "",
    name: "",
    room: "",
    checkin: "",
    checkout: "",
    guests: "",
    total: "",
  });

  const [popupMessage, setPopupMessage] = useState("Booking Successful");
  const [popupVisible, setPopupVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [roomsLoading, setRoomsLoading] = useState(true);

  const minCheckin = todayString();
  const minCheckout = checkin || minCheckin;

  useEffect(() => {
    setRoomsLoading(true);
    fetchRooms()
      .then(setRooms)
      .catch(() => {
        setRooms(FALLBACK_ROOMS);
      })
      .finally(() => {
        setRoomsLoading(false);
      });
  }, []);

  const showPopup = useCallback((message) => {
    setPopupMessage(message);
    setPopupVisible(true);

    setTimeout(() => {
      setPopupVisible(false);
    }, 3000);
  }, []);

  const scrollToRef = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const openBookingSection = () => {
    setShowBookingSection(true);
    requestAnimationFrame(() => scrollToRef(bookingSectionRef));
  };

  const handleRoomBookNow = (_roomName, roomPrice) => {
    setRoom(String(roomPrice));
    setShowBookingSection(true);
    requestAnimationFrame(() => scrollToRef(bookingSectionRef));
  };

  const resetBooking = () => {
    setShowBookingSection(false);
    setShowGuestInfoSection(false);
    setShowConfirmationSection(false);
    setBookingData({});
    setCheckin("");
    setCheckout("");
    setRoom("");
    setGuests(1);
    setGuestName("");
    setGuestEmail("");
    setGuestPhone("");
    setGuestCountry("");
    setConfirmation({
      bookingNumber: "",
      name: "",
      room: "",
      checkin: "",
      checkout: "",
      guests: "",
      total: "",
    });
  };

  const closeGallery = () => {
    setShowGalleryModal(false);
  };

  useEffect(() => {
    const handleNewBookingClick = (event) => {
      if (event.target?.id === "newBookingBtn") {
        resetBooking();
        openBookingSection();
      }
    };

    document.addEventListener("click", handleNewBookingClick);
    return () => document.removeEventListener("click", handleNewBookingClick);
  }, []);

  const handleBookingSubmit = async (event) => {
    event.preventDefault();

    if (checkin === "" || checkout === "" || room === "") {
      showPopup("Please fill in all booking details.");
      return;
    }

    setIsPreviewing(true);

    try {
      const result = await previewBooking({
        checkin,
        checkout,
        roomPrice: room,
        guests,
      });

      setBookingData(result);
      setShowGuestInfoSection(true);
      requestAnimationFrame(() => scrollToRef(guestInfoSectionRef));
      showPopup(`Room available! ${result.nights} night(s) — ${formatCurrency(result.total)}`);
    } catch (error) {
      showPopup(error.message);
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleGuestSubmit = async (event) => {
    event.preventDefault();

    if (
      guestName === "" ||
      guestEmail === "" ||
      guestPhone === "" ||
      guestCountry === ""
    ) {
      showPopup("Please complete all guest information.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createBooking({
        checkin: bookingData.checkin,
        checkout: bookingData.checkout,
        roomPrice: bookingData.roomPrice,
        guests: bookingData.guests,
        guestName,
        guestEmail,
        guestPhone,
        guestCountry,
      });

      setConfirmation({
        bookingNumber: result.bookingNumber,
        name: result.guestName,
        room: result.roomName,
        checkin: result.checkin,
        checkout: result.checkout,
        guests: result.guests,
        total: result.total,
      });

      localStorage.setItem(
        "latestBooking",
        JSON.stringify({
          ...result,
          guestEmail,
          guestPhone,
          guestCountry,
        })
      );

      setShowConfirmationSection(true);
      requestAnimationFrame(() => scrollToRef(confirmationSectionRef));
      showPopup("Booking completed successfully!");
    } catch (error) {
      showPopup(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('/images/unsplash.jpg')] bg-cover bg-center bg-no-repeat text-center font-sans scroll-smooth">
      <nav className="flex justify-between items-center px-10 py-5 bg-black/70">
        <h1 className="text-white text-3xl font-bold">The Sunset</h1>

        <ul className="flex gap-14 list-none">
          <li>
            <a
              href="#"
              className="text-white text-lg hover:text-orange-400 transition duration-300"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#about"
              className="text-white text-lg hover:text-orange-400 transition duration-300"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#rooms"
              className="text-white text-lg hover:text-orange-400 transition duration-300"
            >
              Rooms
            </a>
          </li>
          <li>
            <a
              href="#lookup"
              className="text-white text-lg hover:text-orange-400 transition duration-300"
            >
              My Booking
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="text-white text-lg hover:text-orange-400 transition duration-300"
            >
              Contact
            </a>
          </li>
        </ul>
      </nav>

      <section
        className="h-screen flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/images/hero.jpg')",
        }}
      >
        <h1 className="text-white text-6xl mb-5 bg-black/50 px-6 py-4 rounded-xl">
          Welcome To The Sunset
        </h1>
        <p className="text-white text-2xl bg-black/40 px-5 py-3 rounded-lg">
          Where Every Stay Ends Beautifully
        </p>
      </section>

      <section id="about" className="w-4/5 mx-auto text-center py-20">
        <h2 className="text-6xl mb-5 text-yellow-600">About The Sunset</h2>
        <p className="text-xl max-w-3xl mx-auto leading-8 text-orange-50">
          Welcome to The Sunset — your ideal escape for comfort, style, and
          peaceful evenings.
        </p>
      </section>

      <section id="rooms" className="py-20 bg-white">
        <h2 className="text-5xl font-bold text-center mb-14 text-gray-800">
          Our Rooms
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-10 items-stretch">
          {rooms.map((roomItem) => (
            <div
              key={roomItem.name}
              className="bg-gray-100 rounded-2xl overflow-hidden shadow-lg flex flex-col h-full"
            >
              <img
                src={roomItem.image}
                alt={roomItem.name}
                className="w-full h-80 object-cover"
              />

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-3xl font-bold mb-3 text-gray-800">
                  {roomItem.name}
                </h3>
                <p className="text-orange-500 text-2xl font-semibold mb-4">
                  ${roomItem.price} / night
                </p>
                <p className="text-gray-600 leading-7 mb-6">
                  {roomItem.description}
                </p>
                <button
                  type="button"
                  className="roomBtn mt-auto w-full bg-black text-white py-3 rounded-lg hover:bg-orange-500 transition duration-300"
                  data-room={roomItem.name}
                  data-price={roomItem.price}
                  onClick={() =>
                    handleRoomBookNow(roomItem.name, roomItem.price)
                  }
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <div
          id="galleryModal"
          className={`${showGalleryModal ? "flex" : "hidden"} fixed inset-0 bg-black/80 justify-center items-center z-50`}
        >
          <div className="bg-white p-6 rounded-2xl max-w-4xl w-[90%] relative">
            <button
              type="button"
              onClick={closeGallery}
              className="absolute top-4 right-4 text-3xl font-bold text-gray-700"
            >
              ×
            </button>

            <img
              id="mainImage"
              src=""
              alt=""
              className="w-full h-[500px] object-cover rounded-xl"
            />

            <div
              id="thumbnailContainer"
              className="flex gap-4 mt-5 overflow-x-auto"
            />
          </div>
        </div>
      </section>

      <section
        className="h-[60vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/images/bookingform.jpg')",
        }}
      >
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-4">
            The Luxury Experience You&apos;ll Remember
          </h1>
          <p className="text-xl">
            Comfort, elegance, and unforgettable moments.
          </p>
          <button
            id="bookNowBtn"
            type="button"
            onClick={openBookingSection}
            className="bg-yellow-500 px-8 py-4 rounded-full text-lg font-semibold hover:bg-yellow-600 transition flex items-center gap-3 mx-auto"
          >
            Book Now
            <span className="text-2xl">&gt;</span>
          </button>
        </div>
      </section>

      <section className="bg-white py-20 px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          What Our Guests Say
        </h2>

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <img
            src="/images/Testimonialspic.jpg"
            alt="Guest"
            className="w-80 h-84 rounded-3xl object-cover shadow-lg"
          />

          <div>
            <div className="text-yellow-500 text-2xl mb-4">★★★★★</div>
            <p className="text-gray-700 text-lg leading-8">
              &quot;The rooms were extremely accommodating and allowed us to
              check in early at like 10am.We got there super early and I
              didn&apos;t wanna wait. So this was a big plus. The service was
              exceptional as well. Would definitely send a friend there!&quot;
            </p>
            <h3 className="mt-6 font-bold text-xl">Sarah M.</h3>
          </div>
        </div>
      </section>

      <section
        id="bookingSection"
        ref={bookingSectionRef}
        className={`${showBookingSection ? "" : "hidden"} bg-gray-100 py-20 px-6`}
      >
        <h2 className="text-4xl font-bold text-center mb-10">
          Complete Your Booking
        </h2>

        <form
          id="bookingForm"
          onSubmit={handleBookingSubmit}
          className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6"
        >
          <div>
            <label htmlFor="checkin" className="block text-sm font-medium text-gray-600 mb-1">
              Check-in
            </label>
            <input
              id="checkin"
              type="date"
              min={minCheckin}
              value={checkin}
              onChange={(event) => setCheckin(event.target.value)}
              className="w-full p-4 rounded-lg border"
              required
            />
          </div>

          <div>
            <label htmlFor="checkout" className="block text-sm font-medium text-gray-600 mb-1">
              Check-out
            </label>
            <input
              id="checkout"
              type="date"
              min={minCheckout}
              value={checkout}
              onChange={(event) => setCheckout(event.target.value)}
              className="w-full p-4 rounded-lg border"
              required
            />
          </div>

          <div>
            <label htmlFor="room" className="block text-sm font-medium text-gray-600 mb-1">
              Room
            </label>
            <select
              id="room"
              value={room}
              onChange={(event) => setRoom(event.target.value)}
              className="w-full p-4 rounded-lg border"
              required
              disabled={roomsLoading}
            >
              <option value="">
                {roomsLoading ? "Loading rooms..." : "Select Room"}
              </option>
              {rooms.map((roomItem) => (
                <option key={roomItem.name} value={roomItem.price}>
                  {roomItem.name} (${roomItem.price}/night)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Guests
            </label>
            <div className="flex justify-center items-center gap-6 border rounded-lg p-4">
              <button
                type="button"
                id="minusBtn"
                onClick={() => setGuests((count) => (count > 1 ? count - 1 : count))}
                className="text-3xl"
                aria-label="Decrease guests"
              >
                -
              </button>
              <span id="guestCount" className="text-xl font-bold">
                {guests}
              </span>
              <button
                type="button"
                id="plusBtn"
                onClick={() => setGuests((count) => count + 1)}
                className="text-3xl"
                aria-label="Increase guests"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPreviewing}
            className="md:col-span-2 bg-orange-500 text-white py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 disabled:opacity-60"
          >
            {isPreviewing ? "Checking availability..." : "Continue Booking"}
          </button>
        </form>
      </section>

      <div
        id="popup"
        className={`fixed top-5 right-5 bg-black text-white px-6 py-4 rounded-lg transition-opacity duration-500 ${
          popupVisible
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <p id="popup-message">{popupMessage}</p>
      </div>

      <section
        id="guestInfoSection"
        ref={guestInfoSectionRef}
        className={`${showGuestInfoSection ? "" : "hidden"} py-16 bg-white`}
      >
        <div className="max-w-2xl mx-auto bg-gray-100 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Guest Information
          </h2>

          {bookingData.roomName && (
            <div className="bg-white rounded-xl p-5 mb-6 border border-orange-200">
              <h3 className="font-semibold text-orange-600 mb-3">Booking Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <p><strong>Room:</strong> {bookingData.roomName}</p>
                <p><strong>Guests:</strong> {bookingData.guests}</p>
                <p><strong>Check-in:</strong> {formatDisplayDate(bookingData.checkin)}</p>
                <p><strong>Check-out:</strong> {formatDisplayDate(bookingData.checkout)}</p>
                <p><strong>Nights:</strong> {bookingData.nights}</p>
                <p><strong>Total:</strong> {formatCurrency(bookingData.total)}</p>
              </div>
            </div>
          )}

          <form id="guestForm" onSubmit={handleGuestSubmit}>
            <input
              id="guestName"
              type="text"
              placeholder="Full Name"
              value={guestName}
              onChange={(event) => setGuestName(event.target.value)}
              className="w-full p-4 rounded-lg border mb-4"
              required
            />

            <input
              id="guestEmail"
              type="email"
              placeholder="Email Address"
              value={guestEmail}
              onChange={(event) => setGuestEmail(event.target.value)}
              className="w-full p-4 rounded-lg border mb-4"
              required
            />

            <input
              id="guestPhone"
              type="tel"
              placeholder="Phone Number"
              value={guestPhone}
              onChange={(event) => setGuestPhone(event.target.value)}
              className="w-full p-4 rounded-lg border mb-4"
              required
            />

            <input
              id="guestCountry"
              type="text"
              placeholder="Country"
              value={guestCountry}
              onChange={(event) => setGuestCountry(event.target.value)}
              className="w-full p-4 rounded-lg border mb-6"
              required
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 text-white py-4 rounded-lg hover:bg-orange-600 disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Complete Booking"}
            </button>
          </form>
        </div>
      </section>

      <section
        id="confirmationSection"
        ref={confirmationSectionRef}
        className={`${showConfirmationSection ? "" : "hidden"} py-20 bg-green-50`}
      >
        <div className="max-w-2xl mx-auto bg-white p-10 rounded-2xl shadow-lg">
          <h2 className="text-4xl font-bold text-green-600 mb-6 text-center">
            Booking Confirmed 🎉
          </h2>

          <p className="text-center mb-8">
            Thank you for choosing The Sunset.
          </p>

          <div className="space-y-4 text-lg">
            <p>
              <strong>Booking Number:</strong>{" "}
              <span id="bookingNumber">{confirmation.bookingNumber}</span>
            </p>
            <p>
              <strong>Guest Name:</strong>{" "}
              <span id="confirmName">{confirmation.name}</span>
            </p>
            <p>
              <strong>Room:</strong>{" "}
              <span id="confirmRoom">{confirmation.room}</span>
            </p>
            <p>
              <strong>Check In:</strong>{" "}
              <span id="confirmCheckin">{formatDisplayDate(confirmation.checkin)}</span>
            </p>
            <p>
              <strong>Check Out:</strong>{" "}
              <span id="confirmCheckout">{formatDisplayDate(confirmation.checkout)}</span>
            </p>
            <p>
              <strong>Guests:</strong>{" "}
              <span id="confirmGuests">{confirmation.guests}</span>
            </p>
            <p>
              <strong>Total:</strong>{" "}
              <span id="confirmTotal">{formatCurrency(confirmation.total)}</span>
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              id="newBookingBtn"
              type="button"
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600"
            >
              Make Another Booking
            </button>
            <a
              href="#lookup"
              className="border border-green-600 text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 text-center"
            >
              Find My Booking
            </a>
          </div>
        </div>
      </section>

      <BookingLookup />

      <footer id="contact" className="bg-black text-gray-400 py-16 px-6">
  <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">

    {/* Hotel Info */}
    <div>
      <h3 className="text-2xl font-bold text-white mb-4">
        The Sunset
      </h3>

      <p className="leading-7">
        Experience luxury, comfort, and unforgettable stays.
        Where every stay ends beautifully.
      </p>
    </div>

    {/* Contact */}
    <div>
      <h3 className="text-xl font-semibold text-white mb-4">
        Contact
      </h3>

      <p>📧 hello@thesunset.com</p>
      <p>📞 +254739359089</p>
      <p>📍 4454-00200 Nairobi, Kenya</p>
    </div>

    {/* Quick Links */}
    <div>
      <h3 className="text-xl font-semibold text-white mb-4">
        Quick Links
      </h3>

      <div className="flex flex-col gap-2">
        <a href="#about" className="hover:text-orange-400">
          About
        </a>

        <a href="#rooms" className="hover:text-orange-400">
          Rooms
        </a>

        <a href="#lookup" className="hover:text-orange-400">
          My Booking
        </a>

        <a href="#contact" className="hover:text-orange-400">
          Contact
        </a>
      </div>
    </div>

  </div>

  <div className="border-t border-gray-800 mt-10 pt-6 text-center">
    <p>
      © {new Date().getFullYear()} The Sunset Hotel. All rights reserved.
    </p>
  </div>
</footer>
    </div>
  );
}
export default App;
