const bookingForm = document.getElementById("bookingForm");

const popup = document.getElementById("popup");

const popupMessage = document.getElementById("popup-message");

bookingForm.addEventListener("submit", function(event){

    event.preventDefault();

    const checkin = document.getElementById("checkin").value;

    const checkout = document.getElementById("checkout").value;

    const guests = document.getElementById("guests").value;

    const room = document.getElementById("room").value;

    // Empty fields validation
    if(
        checkin === "" ||
        checkout === "" ||
        guests === "" ||
        room === ""
    ){
        showPopup("Please fill in all booking details.");
        return;
    }

    // Date validation
    if(checkout <= checkin){
        showPopup("Check-out date must be after check-in.");
        return;
    }

    // Success
    showPopup("Room available! Please proceed to booking.");
});


// Popup Function
function showPopup(message){

    popupMessage.textContent = message;

    popup.classList.add("show");

    // Hide popup after 3 seconds
    setTimeout(function(){

        popup.classList.remove("show");

    }, 3000);
}
localStorage.setItem("booking", JSON.stringify(data));