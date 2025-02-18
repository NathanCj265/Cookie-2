// Initialize data
let points = parseInt(localStorage.getItem("points")) || 0;
let autoClickers = parseInt(localStorage.getItem("autoClickers")) || 0;
let clickPower = parseInt(localStorage.getItem("clickPower")) || 1;

// Set the display of initial data
document.getElementById("points").innerText = points;
document.getElementById("autoclickers").innerText = autoClickers;
document.getElementById("clickPower").innerText = clickPower;

// Auto-clicker upgrade costs and stats
let autoclickerCosts = [10, 50, 100, 200, 500, 1000, 2000, 5000]; // Cost for each autoclicker upgrade
let autoclickerPoints = [1, 2, 5, 10, 20, 50, 100, 200]; // Points per second for each autoclicker

// Upgrade costs for unique upgrades
let upgradeCosts = [50, 200, 500, 1000, 2500]; // Costs for click power upgrades
let upgradeBoosts = [1, 2, 5, 10, 20]; // Boost for each upgrade

// Save game data to localStorage
function saveGame() {
    localStorage.setItem("points", points);
    localStorage.setItem("autoClickers", autoClickers);
    localStorage.setItem("clickPower", clickPower);
}

// Click cookie function
function clickCookie() {
    points += clickPower;
    document.getElementById("points").innerText = points;
    saveGame();
}

// Auto-clicker purchase function
function buyAutoClicker(index) {
    if (points >= autoclickerCosts[index]) {
        points -= autoclickerCosts[index];
        autoClickers += autoclickerPoints[index];
        document.getElementById("points").innerText = points;
        document.getElementById("autoclickers").innerText = autoClickers;
        saveGame();
    }
}

// Upgrade purchase function
function buyUpgrade(index) {
    if (points >= upgradeCosts[index]) {
        points -= upgradeCosts[index];
        clickPower += upgradeBoosts[index];
        document.getElementById("points").innerText = points;
        document.getElementById("clickPower").innerText = clickPower;
        saveGame();
    }
}

// Set interval for auto-clickers to generate points
setInterval(() => {
    points += autoClickers;
    document.getElementById("points").innerText = points;
    saveGame();
}, 1000);

// Event listener for cookie click
document.getElementById("cookie").addEventListener("click", clickCookie);

