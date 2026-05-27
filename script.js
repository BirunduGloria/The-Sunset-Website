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

let guests = 1;


// Increase Guests
plusBtn.addEventListener("click", function(){

    guests++;

    guestCount.textContent = guests;

});


// Decrease Guests
minusBtn.addEventListener("click", function(){

    if(guests > 1){

        guests--;

        guestCount.textContent = guests;

    }

});


// Booking Form
bookingForm.addEventListener("submit", function(event){

    event.preventDefault();

    const checkin =
        document.getElementById("checkin").value;

    const checkout =
        document.getElementById("checkout").value;

    const room =
        document.getElementById("room").value;

    // Validation
    if(
        checkin === "" ||
        checkout === "" ||
        guests < 1 ||
        room === ""
    ){

        showPopup(
            "Please fill in all booking details."
        );

        return;
    }

    // Date validation
    if(checkout <= checkin){

        showPopup(
            "Check-out date must be after check-in."
        );

        return;
    }

    // Room details
    const roomSelect =
        document.getElementById("room");

    const roomName =
        roomSelect.options[
            roomSelect.selectedIndex
        ].text;

    const roomPrice =
        Number(roomSelect.value);

    // Calculate nights
    const checkinDate =
        new Date(checkin);

    const checkoutDate =
        new Date(checkout);

    const timeDifference =
        checkoutDate - checkinDate;

    const nights =
        timeDifference / (1000 * 60 * 60 * 24);

    // Calculate total
    const total =
        nights * roomPrice;

    // Update summary
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

    // Show summary card
    document
        .getElementById("summaryCard")
        .classList.remove("hidden");

    // Popup
    showPopup(
        "Room available! Please proceed to booking."
    );

});


// Popup Function
function showPopup(message){

    popupMessage.textContent = message;

    popup.classList.remove("opacity-0");

    popup.classList.add("opacity-100");

    setTimeout(function(){

        popup.classList.remove("opacity-100");

        popup.classList.add("opacity-0");

    }, 3000);

}
