document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();

    switch (key) {
        case "i":
            startIntroSlideshow();
            break;
        case "arrowdown":
            event.preventDefault()
            nextIntroStep();
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
            endShow();
            break;
    }
});



const shoeSize = 1000;

let currentIntroStep = 0;
let slideshowActive = false;

const titleCard = document.getElementById("title-card");
const whiteOverlay = document.querySelector(".white-overlay")
const tillyEnd = document.getElementById("tilly-end")


//intro els
const tilly = document.getElementById("tilly");
const bata = document.getElementById("bata");
const bootsEnter = document.getElementById("BootsEnter");
const bootsSpin = document.getElementById("BootsSpin");
const bootsStill = document.getElementById("BootsStill");
const earth = document.getElementById("earth");
const explosion = document.getElementById("Explosion");
const floor = document.getElementById("Floor");
const pile = document.getElementById("pile");
const scene3 = document.getElementById("scene3");
const shoe = document.getElementById("shoe");




const TOTAL_SHOES_PER_BANK = 10;

let mainActive = false;
let currentBank = null;

const shoeStage = document.getElementById("shoeStage");



let votingActive = false;
let leftShoe = null;
let rightShoe = null;
let winningShoe = null;



let evilTilly = null;
let evilTillyActive = false;
let evilDX = 3;
let evilDY = 2;
let evilInterval = null;
let evilTillyHasSpawned = false;
let evilHasEnteredScreen = false;



function startIntroSlideshow() {
    whiteOverlay.style.opacity = 0
    tillyEnd.style.display = "none"
    clearShoeStage()
    currentIntroStep = 0;
    slideshowActive = true;
    titleCard.style.display = "block";
}


function nextIntroStep() {
    if (!slideshowActive) return;
    currentIntroStep++;

    switch (currentIntroStep) {
        case 1:
            titleCard.style.display = "none";
            setTimeout(() => {
                tilly.style.opacity = 1
            }, 1000)
            return
        case 2:
            shoe.style.opacity = 1
            return
        case 3:
            tilly.style.opacity = 0
            shoe.style.opacity = 0
            return
        case 4:
            earth.style.top = 0
            return
        case 5:
            bata.style.opacity = 1
            return
        case 6:
            pile.style.top = 0
            return
        case 7:
            bata.style.opacity = 0
            pile.style.opacity = 0
            earth.style.opacity = 0
    nextIntroStep()
            return
        case 8:
            scene3.style.opacity = 1
            floor.style.opacity = 1
            return
        case 9:
            bootsEnter.style.display = "block"
            setTimeout(() => {
                bootsEnter.style.display = "none"
                bootsStill.style.display = "block"
            }, 300)
            setTimeout(() => {
                bootsStill.style.display = "none"
                bootsSpin.style.display = "block"
            }, 2000)
            return
        case 10:
            explosion.style.display = "block"
            return
        case 11:

            return
        case 12:
            return
    }



}






function startMainWithShoeBank(bankNumber) {
    mainActive = true;
    currentBank = bankNumber;

    slideshowActive = false;

    bootsSpin.style.display = "none"
    explosion.style.display = "none"
    scene3.style.opacity = 0
    floor.style.opacity = 0





    shoeStage.innerHTML = "";
    shoeStage.style.display = "block";

    const centerX = window.innerWidth / 2 - shoeSize + 400;
    const maxX = window.innerWidth - shoeSize;
    const maxY = window.innerHeight - shoeSize + 200;

    for (let i = 1; i <= 10; i++) {
        const img = document.createElement("img");
        img.src = `shoe-${bankNumber}/${i}.png`;
        img.className = "shoe";

        // Start ABOVE viewport
        img.style.left = `${centerX}px`;
        img.style.top = `-450px`;

        const finalX = Math.random() * maxX;
        const finalY = Math.random() * maxY;

        shoeStage.appendChild(img);

        // Force layout
        img.getBoundingClientRect();

        const delay = Math.random() * 1200;

        setTimeout(() => {
            // Snap to final position BEFORE animation
            img.style.left = `${finalX}px`;
            img.style.top = `${finalY}px`;
            img.classList.add("scatter-in");
        }, delay);
    }
}

function startVote() {
    if (!mainActive || votingActive) return;
    votingActive = true;

    const shoes = [...document.querySelectorAll(".shoe")];
    shoes.forEach(shoe => shoe.style.opacity = "0");

    const shuffled = shoes.sort(() => Math.random() - 0.5);
    leftShoe = shuffled[0];
    rightShoe = shuffled[1];

    // RESET positioning
    [leftShoe, rightShoe].forEach(shoe => {
        shoe.style.left = "";
        shoe.style.top = "";
        // shoe.style.transform = "translateY(-50%)";
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
    if (shoes.length === 6 || shoes.length === 2) {
        spawnEvilTilly()
    }

    if (shoes.length === 1) {
        const finalShoe = shoes[0];
        finalShoe.classList.add("vote-winner")


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
    if (!evilTillyActive || !evilTilly) return;

    clearInterval(evilInterval);

    evilTilly.src = "BootsBase.png";
    evilTilly.classList.add("evil-hit");

    // Fly offscreen after spin
    setTimeout(() => {
        evilTilly.style.left = `${window.innerWidth + 400}px`;
        evilTilly.style.top = `-400px`;
    }, 200);

    // Cleanup
    setTimeout(() => {
        evilTilly.remove();
        evilTilly = null;
        evilTillyActive = false;
    }, 1200);
}

function endShow() {
    clearShoeStage()
    slideshowActive = false;
    whiteOverlay.style.opacity = 1
    setTimeout(() => {
        tillyEnd.style.display = "block"
        setTimeout(() => {
            tillyEnd.src = "tillyDance.GIF"
        }, 3000)
    }, 5000)
}


function clearShoeStage() {
    mainActive = false;
    shoeStage.style.display = "none";
    shoeStage.innerHTML = "";
}



function scatterShoes(shoes) {
    const maxX = window.innerWidth - shoeSize + 200;
    const maxY = 200;

    shoes.forEach(shoe => {
        const x = Math.random() * maxX;
        const y = Math.random() * maxY;

        shoe.style.left = `${x}px`;
        shoe.style.top = `${y}px`;
    });
}

function spawnEvilTilly() {
    evilTillyActive = true;
    evilHasEnteredScreen = false;

    evilTilly = document.createElement("img");
    evilTilly.src = "BootsBase.png";
    evilTilly.className = "evil-tilly";

    const size = 300;

    const side = Math.floor(Math.random() * 4);
    let x, y;

    if (side === 0) { // left
        x = -size;
        y = Math.random() * (window.innerHeight - size);
        evilDX = 3 + Math.random() * 3;   // force RIGHT
        evilDY = (Math.random() * 4) - 2;
    }

    if (side === 1) { // right
        x = window.innerWidth + size;
        y = Math.random() * (window.innerHeight - size);
        evilDX = -(3 + Math.random() * 3); // force LEFT
        evilDY = (Math.random() * 4) - 2;
    }

    if (side === 2) { // top
        x = Math.random() * (window.innerWidth - size);
        y = -size;
        evilDX = (Math.random() * 4) - 2;
        evilDY = 3 + Math.random() * 3;   // force DOWN
    }

    if (side === 3) { // bottom
        x = Math.random() * (window.innerWidth - size);
        y = window.innerHeight + size;
        evilDX = (Math.random() * 4) - 2;
        evilDY = -(3 + Math.random() * 3); // force UP
    }

    evilTilly.style.left = `${x}px`;
    evilTilly.style.top = `${y}px`;

    document.body.appendChild(evilTilly);

    evilInterval = setInterval(moveEvilTilly, 16);
}


function moveEvilTilly() {
    let x = parseFloat(evilTilly.style.left);
    let y = parseFloat(evilTilly.style.top);
    const size = 300;

    x += evilDX;
    y += evilDY;

    // Detect first entry into screen
    if (
        x > 0 &&
        y > 0 &&
        x + size < window.innerWidth &&
        y + size < window.innerHeight
    ) {
        evilHasEnteredScreen = true;
    }

    // Only bounce AFTER fully inside screen at least once
    if (evilHasEnteredScreen) {
        if (x <= 0 || x + size >= window.innerWidth) evilDX *= -1;
        if (y <= 0 || y + size >= window.innerHeight) evilDY *= -1;
    }

    evilTilly.style.left = `${x}px`;
    evilTilly.style.top = `${y}px`;
}
