// ======================
// DOM ELEMENTS
// ======================

const bookingForm = document.getElementById("bookingForm");
const guestForm = document.getElementById("guestForm");

const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");

const minusBtn = document.getElementById("minusBtn");
const plusBtn = document.getElementById("plusBtn");
const guestCount = document.getElementById("guestCount");

const bookNowBtn = document.getElementById("bookNowBtn");
const bookingSection = document.getElementById("bookingSection");

let guests = 1;

// ======================
// BOOK NOW BUTTON
// ======================

if (bookNowBtn && bookingSection) {
    bookNowBtn.addEventListener("click", () => {
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
    plusBtn.addEventListener("click", () => {
        guests++;
        guestCount.textContent = guests;
    });
}

if (minusBtn) {
    minusBtn.addEventListener("click", () => {
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

        const timeDifference =
            checkoutDate - checkinDate;

        const nights =
            timeDifference /
            (1000 * 60 * 60 * 24);

        const total =
            nights * roomPrice;

        document.getElementById(
            "summaryRoom"
        ).textContent = roomName;

        document.getElementById(
            "summaryGuests"
        ).textContent = guests;

        document.getElementById(
            "summaryNights"
        ).textContent = nights;

        document.getElementById(
            "summaryTotal"
        ).textContent = total;

        const guestInfoSection =
            document.getElementById(
                "guestInfoSection"
            );

        if (guestInfoSection) {

            guestInfoSection
                .classList.remove("hidden");

            guestInfoSection
                .scrollIntoView({
                    behavior: "smooth"
                });
        }

        showPopup(
            "Room available! Please enter your details."
        );
    });
}

// ======================
// GUEST FORM
// ======================

if (guestForm) {

    guestForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const name =
                document.getElementById(
                    "guestName"
                ).value;

            const email =
                document.getElementById(
                    "guestEmail"
                ).value;

            const phone =
                document.getElementById(
                    "guestPhone"
                ).value;

            const country =
                document.getElementById(
                    "guestCountry"
                ).value;

            if (
                name === "" ||
                email === "" ||
                phone === "" ||
                country === ""
            ) {
                showPopup(
                    "Please complete all guest details."
                );

                return;
            }

            const bookingNumber =
                "SUN-" +
                Math.floor(
                    100000 +
                    Math.random() * 900000
                );

            // Confirmation Details

            document.getElementById(
                "bookingNumber"
            ).textContent =
                bookingNumber;

            document.getElementById(
                "confirmName"
            ).textContent =
                name;

            document.getElementById(
                "confirmRoom"
            ).textContent =
                document.getElementById(
                    "summaryRoom"
                ).textContent;

            document.getElementById(
                "confirmCheckin"
            ).textContent =
                document.getElementById(
                    "checkin"
                ).value;

            document.getElementById(
                "confirmCheckout"
            ).textContent =
                document.getElementById(
                    "checkout"
                ).value;

            document.getElementById(
                "confirmGuests"
            ).textContent =
                guests;

            document.getElementById(
                "confirmTotal"
            ).textContent =
                document.getElementById(
                    "summaryTotal"
                ).textContent;

            // Save Booking

            const bookingData = {

                bookingNumber,

                name,
                email,
                phone,
                country,

                room:
                    document.getElementById(
                        "summaryRoom"
                    ).textContent,

                guests,

                nights:
                    document.getElementById(
                        "summaryNights"
                    ).textContent,

                total:
                    document.getElementById(
                        "summaryTotal"
                    ).textContent,

                checkin:
                    document.getElementById(
                        "checkin"
                    ).value,

                checkout:
                    document.getElementById(
                        "checkout"
                    ).value
            };

            localStorage.setItem(
                "booking",
                JSON.stringify(
                    bookingData
                )
            );

            const confirmationSection =
                document.getElementById(
                    "confirmationSection"
                );

            if (
                confirmationSection
            ) {

                confirmationSection
                    .classList.remove(
                        "hidden"
                    );

                confirmationSection
                    .scrollIntoView({
                        behavior:
                            "smooth"
                    });
            }

            showPopup(
                "Booking completed successfully!"
            );
        }
    );
}

// ======================
// POPUP FUNCTION
// ======================

function showPopup(message) {

    if (!popup || !popupMessage)
        return;

    popupMessage.textContent =
        message;

    popup.classList.remove(
        "opacity-0"
    );

    popup.classList.add(
        "opacity-100"
    );

    setTimeout(() => {

        popup.classList.remove(
            "opacity-100"
        );

        popup.classList.add(
            "opacity-0"
        );

    }, 3000);
}