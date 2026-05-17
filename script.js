const bookingForm = document.getElementById("bookingForm");

bookingForm.addEventListener("submit", function(event){

    event.preventDefault();

    // Get form values
    const checkin = document.getElementById("checkin").value;

    const checkout = document.getElementById("checkout").value;

    const guests = document.getElementById("guests").value;

    const room = document.getElementById("room").value;

    // Check empty fields
    if(
        checkin === "" ||
        checkout === "" ||
        guests === "" ||
        room === ""
    ){
        alert("Please fill in all fields.");
        return;
    }

    // Date validation
    if(checkout <= checkin){
        alert("Check-out date must be after check-in date.");
        return;
    }

    // Success message
    alert("Room available! Your booking search was successful.");

});