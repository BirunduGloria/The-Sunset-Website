// ======================
// DOM ELEMENTS
// ======================

const bookingForm =
    document.getElementById("bookingForm");

const popup =
    document.getElementById("popup");

const popupMessage =
    document.getElementById("popup-message");

const minusBtn =
    document.getElementById("minusBtn");

const plusBtn =
    document.getElementById("plusBtn");

const guestCount =
    document.getElementById("guestCount");

const bookNowBtn =
    document.getElementById("bookNowBtn");

const bookingSection =
    document.getElementById("bookingSection");

let guests = 1;


// ======================
// BOOK NOW BUTTON
// ======================

if (bookNowBtn && bookingSection) {

    bookNowBtn.addEventListener("click", function () {

        bookingSection.classList.remove("hidden");

        bookingSection.scrollIntoView({

            behavior: "smooth"

        });

    });

}


// ======================
// GUEST COUNTER
// ======================

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


// ======================
// BOOKING FORM
// ======================

if (bookingForm) {

    bookingForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const checkin =
            document.getElementById("checkin").value;

        const checkout =
            document.getElementById("checkout").value;

        const room =
            document.getElementById("room").value;

        // Validation
        if (
            checkin === "" ||
            checkout === "" ||
            room === "" ||
            guests < 1
        ) {

            showPopup(
                "Please fill in all booking details."
            );

            return;

        }

        // Date Validation
        if (checkout <= checkin) {

            showPopup(
                "Check-out date must be after check-in."
            );

            return;

        }

        // Room Information
        const roomSelect =
            document.getElementById("room");

        const roomName =
            roomSelect.options[
                roomSelect.selectedIndex
            ].text;

        const roomPrice =
            Number(roomSelect.value);

        // Calculate Nights
        const checkinDate =
            new Date(checkin);

        const checkoutDate =
            new Date(checkout);

        const timeDifference =
            checkoutDate - checkinDate;

        const nights =
            timeDifference /
            (1000 * 60 * 60 * 24);

        // Calculate Total
        const total =
            nights * roomPrice;

        // Update Summary Card
        document
            .getElementById("summaryRoom")
            .textContent = roomName;

        document
            .getElementById("summaryGuests")
            .textContent = guests;

        document
            .getElementById("summaryNights")
            .textContent = nights;

        document
            .getElementById("summaryTotal")
            .textContent = total;

        // Show Summary Card
        document
            .getElementById("summaryCard")
            .classList.remove("hidden");

        // Success Popup
        showPopup(
            "Room available! Please proceed to booking."
        );

    });

}


// ======================
// POPUP FUNCTION
// ======================

function showPopup(message) {

    if (!popup || !popupMessage) return;

    popupMessage.textContent = message;

    popup.classList.remove("opacity-0");

    popup.classList.add("opacity-100");

    setTimeout(function () {

        popup.classList.remove("opacity-100");

        popup.classList.add("opacity-0");

    }, 3000);

}