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



const TOTAL_SLIDES = 5;

let currentSlide = 1;
let slideshowActive = false;

const slideshowImg = document.getElementById("slideshow");
const endVideo = document.getElementById("endVideo");



const TOTAL_SHOES_PER_BANK = 10;

let mainActive = false;
let currentBank = null;

const shoeStage = document.getElementById("shoeStage");



let votingActive = false;
let leftShoe = null;
let rightShoe = null;
let winningShoe = null;

let voteOverlay = null;


// --- Placeholder functions ---

function startIntroSlideshow() {
    clearShoeStage()
    currentSlide = 1;
    slideshowActive = true;

    endVideo.pause();
    endVideo.style.display = "none";

    slideshowImg.src = `intro-slides/${currentSlide}.png`;
    slideshowImg.style.display = "block";
}

function nextSlide() {
    if (!slideshowActive) return;

    currentSlide++;

    if (currentSlide > TOTAL_SLIDES) {
        // End slideshow
        slideshowActive = false;
        slideshowImg.style.display = "none";
        return;
    }

    slideshowImg.src = `intro-slides/${currentSlide}.png`;
}
function startMainWithShoeBank(bankNumber) {
    mainActive = true;
    currentBank = bankNumber;

    // Hide other modes
    slideshowActive = false;
    slideshowImg.style.display = "none";
    endVideo.pause();
    endVideo.style.display = "none";

    // Reset stage
    shoeStage.innerHTML = "";
    shoeStage.style.display = "block";

    const centerX = window.innerWidth / 2 - 50;
    const centerY = window.innerHeight / 2 - 50;

    const maxX = window.innerWidth - 100;
    const maxY = window.innerHeight - 100;

    for (let i = 1; i <= 10; i++) {
        const img = document.createElement("img");
        img.src = `shoe-${bankNumber}/${i}.png`;
        img.className = "shoe";

        // Start at center
        img.style.left = `${centerX}px`;
        img.style.top = `${centerY}px`;

        // Calculate final random position
        const finalX = Math.random() * maxX;
        const finalY = Math.random() * maxY;

        shoeStage.appendChild(img);

        // Force layout so transition triggers correctly
        img.getBoundingClientRect();

        // Staggered scatter timing (feels alive but controlled)
        const delay = Math.random() * 3000;

        setTimeout(() => {
            img.style.left = `${finalX}px`;
            img.style.top = `${finalY}px`;
            img.classList.add("scatter-in");
        }, delay);
    }
}

function startVote() {
    if (!mainActive || votingActive) return;
    votingActive = true;

    document.getElementById("vote-overlay").style.visibility = "visible"


    const shoes = [...document.querySelectorAll(".shoe")];
    shoes.forEach(shoe => shoe.style.opacity = "0");

    const shuffled = shoes.sort(() => Math.random() - 0.5);
    leftShoe = shuffled[0];
    rightShoe = shuffled[1];

    // RESET positioning
    [leftShoe, rightShoe].forEach(shoe => {
        shoe.style.left = "";
        shoe.style.top = "";
        shoe.style.transform = "translateY(-50%)";
        shoe.style.opacity = "1";
        shoe.style.position = "fixed";
    });

    leftShoe.classList.add("vote-shoe", "vote-left");
    rightShoe.classList.add("vote-shoe", "vote-right");
}


function displayWinner(direction) {
    if (!votingActive) return;

    if (direction === "left") {
        winningShoe = leftShoe;
        rightShoe.classList.add("vote-loser");
    } else if (direction === "right") {
        winningShoe = rightShoe;
        leftShoe.classList.add("vote-loser");
    } else {
        return;
    }

    winningShoe.classList.add("vote-winner");
}

function returnToMain() {
    if (!votingActive) return;

    // Remove winning shoe permanently
    if (winningShoe) {
        winningShoe.remove();
    }

    // Hide overlay
    document.getElementById("vote-overlay").style.visibility = "hidden";

    const shoes = document.querySelectorAll(".shoe");

    shoes.forEach(shoe => {
        shoe.style.position = "absolute";
        shoe.style.opacity = "1";
        shoe.style.transform = "scale(1)";

        shoe.classList.remove(
            "vote-shoe",
            "vote-left",
            "vote-right",
            "vote-winner",
            "vote-loser"
        );
    });

    // 🔥 SPECIAL CASE: only one shoe left
    if (shoes.length === 1) {
        const finalShoe = shoes[0];
        finalShoe.style.transition = "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)";

        finalShoe.style.left = "50%";
        finalShoe.style.top = "50%";
        finalShoe.style.transform = "translate(-50%, -50%) scale(5)";
        finalShoe.style.zIndex = "50";

    } else {
        // Normal behavior: re-scatter remaining shoes
        scatterShoes(shoes);
    }

    // Reset state
    votingActive = false;
    leftShoe = null;
    rightShoe = null;
    winningShoe = null;
}




function banishEvilTilly() {
    console.log("Banish evil Tilly!");
}
function startEndVideo() {
    clearShoeStage()
    slideshowActive = false;
    slideshowImg.style.display = "none";

    endVideo.currentTime = 0;
    endVideo.style.display = "block";
    endVideo.play();
}


function clearShoeStage() {
    mainActive = false;
    shoeStage.style.display = "none";
    shoeStage.innerHTML = "";
}



function scatterShoes(shoes) {
    const maxX = window.innerWidth - 100;
    const maxY = window.innerHeight - 100;

    shoes.forEach(shoe => {
        const x = Math.random() * maxX;
        const y = Math.random() * maxY;

        shoe.style.left = `${x}px`;
        shoe.style.top = `${y}px`;
    });
}
