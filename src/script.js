// Initialize the game variables
let points = parseInt(localStorage.getItem("points")) || 0;
let autoClickers = parseInt(localStorage.getItem("autoClickers")) || 0;
let clickPower = parseInt(localStorage.getItem("clickPower")) || 1;

// Update UI with initial values
document.getElementById("points").innerText = points;
document.getElementById("autoclickers").innerText = autoClickers;
document.getElementById("clickPower").innerText = clickPower;

// Save game data to localStorage
function saveGame() {
    localStorage.setItem("points", points);
    localStorage.setItem("autoClickers", autoClickers);
    localStorage.setItem("clickPower", clickPower);
}

// Click on the cookie to increase points
function clickCookie() {
    points += clickPower;
    document.getElementById("points").innerText = points;
    saveGame();
}

// Buy an auto-clicker
function buyAutoClicker() {
    if (points >= 10) {
        points -= 10;
        autoClickers++;
        document.getElementById("points").innerText = points;
        document.getElementById("autoclickers").innerText = autoClickers;
        saveGame();
    }
}

// Buy an upgrade to increase click power
function buyUpgrade() {
    if (points >= 50) {
        points -= 50;
        clickPower++;
        document.getElementById("points").innerText = points;
        document.getElementById("clickPower").innerText = clickPower;
        saveGame();
    }
}

// Automatically gain points based on auto-clickers
setInterval(() => {
    points += autoClickers;
    document.getElementById("points").innerText = points;
    saveGame();
}, 1000);
