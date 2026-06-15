// ===========================
// DOM ELEMENTS
// ===========================

const bookingForm = document.getElementById("bookingForm");
const guestForm = document.getElementById("guestForm");

const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");

const bookNowBtn = document.getElementById("bookNowBtn");
const bookingSection = document.getElementById("bookingSection");

const minusBtn = document.getElementById("minusBtn");
const plusBtn = document.getElementById("plusBtn");
const guestCount = document.getElementById("guestCount");

const roomButtons = document.querySelectorAll(".roomBtn");

let guests = 1;

let bookingData = {};

// ===========================
// ROOM CARD BOOK NOW BUTTONS
// ===========================

roomButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const roomName = this.dataset.room;
    const roomPrice = this.dataset.price;

    document.getElementById("room").value = roomPrice;

    const selectedRoomName =
      document.getElementById("selectedRoomName");

    const selectedRoomPrice =
      document.getElementById("selectedRoomPrice");

    if (selectedRoomName) {
      selectedRoomName.value = roomName;
    }

    if (selectedRoomPrice) {
      selectedRoomPrice.value = roomPrice;
    }

    bookingSection.classList.remove("hidden");

    bookingSection.scrollIntoView({
      behavior: "smooth",
    });
  });
});

// ===========================
// HERO BOOK NOW BUTTON
// ===========================

if (bookNowBtn) {
  bookNowBtn.addEventListener("click", function () {
    bookingSection.classList.remove("hidden");

    bookingSection.scrollIntoView({
      behavior: "smooth",
    });
  });
}

// ===========================
// GUEST COUNTER
// ===========================

if (plusBtn) {
  plusBtn.addEventListener("click", function () {
    guests++;
    guestCount.textContent = guests;
  });
}

if (minusBtn) {
  minusBtn.addEventListener("click", function () {
    if (guests > 1) {
      guests--;
      guestCount.textContent = guests;
    }
  });
}

// ===========================
// BOOKING FORM
// ===========================

if (bookingForm) {
  bookingForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const checkin =
      document.getElementById("checkin").value;

    const checkout =
      document.getElementById("checkout").value;

    const room =
      document.getElementById("room").value;

    if (
      checkin === "" ||
      checkout === "" ||
      room === ""
    ) {
      showPopup(
        "Please fill in all booking details."
      );
      return;
    }

    if (checkout <= checkin) {
      showPopup(
        "Check-out date must be after check-in."
      );
      return;
    }

    const roomSelect =
      document.getElementById("room");

    const roomName =
      roomSelect.options[
        roomSelect.selectedIndex
      ].text;

    const roomPrice =
      Number(roomSelect.value);

    const checkinDate =
      new Date(checkin);

    const checkoutDate =
      new Date(checkout);

    const nights =
      (checkoutDate - checkinDate) /
      (1000 * 60 * 60 * 24);

    const total =
      nights * roomPrice;

    bookingData = {
      roomName,
      roomPrice,
      checkin,
      checkout,
      nights,
      total,
      guests,
    };

    document
      .getElementById("guestInfoSection")
      .classList.remove("hidden");

    document
      .getElementById("guestInfoSection")
      .scrollIntoView({
        behavior: "smooth",
      });

    showPopup(
      "Room available! Please enter guest details."
    );
  });
}

// ===========================
// GUEST INFORMATION FORM
// ===========================

if (guestForm) {
  guestForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const guestName =
      document.getElementById("guestName").value;

    const guestEmail =
      document.getElementById("guestEmail").value;

    const guestPhone =
      document.getElementById("guestPhone").value;

    const guestCountry =
      document.getElementById("guestCountry").value;

    if (
      guestName === "" ||
      guestEmail === "" ||
      guestPhone === "" ||
      guestCountry === ""
    ) {
      showPopup(
        "Please complete all guest information."
      );
      return;
    }

    const bookingNumber =
      "SUN-" +
      Math.floor(
        100000 + Math.random() * 900000
      );

    document.getElementById(
      "bookingNumber"
    ).textContent = bookingNumber;

    document.getElementById(
      "confirmName"
    ).textContent = guestName;

    document.getElementById(
      "confirmRoom"
    ).textContent = bookingData.roomName;

    document.getElementById(
      "confirmCheckin"
    ).textContent = bookingData.checkin;

    document.getElementById(
      "confirmCheckout"
    ).textContent = bookingData.checkout;

    document.getElementById(
      "confirmGuests"
    ).textContent = bookingData.guests;

    document.getElementById(
      "confirmTotal"
    ).textContent = bookingData.total;

    const completeBooking = {
      bookingNumber,
      guestName,
      guestEmail,
      guestPhone,
      guestCountry,
      ...bookingData,
    };

    localStorage.setItem(
      "latestBooking",
      JSON.stringify(completeBooking)
    );

    document
      .getElementById("confirmationSection")
      .classList.remove("hidden");

    document
      .getElementById("confirmationSection")
      .scrollIntoView({
        behavior: "smooth",
      });

    showPopup(
      "Booking completed successfully!"
    );
  });
}

// ===========================
// NEW BOOKING BUTTON
// ===========================

document.addEventListener(
  "click",
  function (event) {
    if (
      event.target &&
      event.target.id === "newBookingBtn"
    ) {
      location.reload();
    }
  }
);

// ===========================
// POPUP FUNCTION
// ===========================

function showPopup(message) {
  popupMessage.textContent = message;

  popup.classList.remove("opacity-0");
  popup.classList.add("opacity-100");

  setTimeout(() => {
    popup.classList.remove("opacity-100");
    popup.classList.add("opacity-0");
  }, 3000);
}