document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();

    switch (key) {
        case "i":
            startIntroSlideshow();
            break;
        case "arrowdown":
            event.preventDefault()
            nextSlide();
            break;
        case "1":
            startMainWithShoeBank(1);
            break;
        case "2":
            startMainWithShoeBank(2);
            break;
        case "3":
            startMainWithShoeBank(3);
            break;
        case " ":
            event.preventDefault(); // Prevent scroll
            startVote();
            break;
        case "arrowleft":
            event.preventDefault(); // Prevent scroll
            displayWinner("left");
            break;
        case "arrowright":
            event.preventDefault(); // Prevent scroll
            displayWinner("right");
            break;
        case "r":
            returnToMain();
            break;
        case "b":
            banishEvilTilly();
            break;
        case "e":
            startEndVideo();
            break;
    }
});

// --- Placeholder functions ---

function startIntroSlideshow() {
    console.log("Starting intro slideshow from beginning...");
}

function nextSlide() {
    console.log("Moving to next slide...");
}

function startMainWithShoeBank(bankNumber) {
    console.log(`Starting main with shoe bank ${bankNumber}...`);
}

function startVote() {
    console.log("Starting vote...");
}

function displayWinner(direction) {
    console.log(`Displaying winner from the ${direction}, removing from room...`);
}

function returnToMain() {
    console.log("Returning to main...");
}

function banishEvilTilly() {
    console.log("Banish evil Tilly!");
}

function startEndVideo() {
    console.log("Starting end video, will cut to game over screen at end...");
}
