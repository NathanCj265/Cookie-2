let points = parseInt(localStorage.getItem("points")) || 0;
let autoClickers = parseInt(localStorage.getItem("autoClickers")) || 0;
let clickPower = parseInt(localStorage.getItem("clickPower")) || 1;
let autoClickerSpeed = [0, 1, 2, 3]; 
let clickerNames = ["Cookie Clicker", "Double Clicker", "Triple Clicker"]; 
let upgradeNames = ["Click Power", "Auto-Clicker Speed", "Point Multiplier"]; 
let upgradePrices = [50, 200, 500]; 
let autoClickerPrices = [10, 50, 200]; 

document.getElementById("points").innerText = points;
document.getElementById("autoclickers").innerText = autoClickers;
document.getElementById("clickPower").innerText = clickPower;


function saveGame() {
    localStorage.setItem("points", points);
    localStorage.setItem("autoClickers", autoClickers);
    localStorage.setItem("clickPower", clickPower);
    localStorage.setItem("autoClickerSpeed", JSON.stringify(autoClickerSpeed));
}


function clickCookie() {
    points += clickPower;
    document.getElementById("points").innerText = points;
    saveGame();
}


function buyAutoClicker(level) {
    if (points >= autoClickerPrices[level - 1]) {
        points -= autoClickerPrices[level - 1];
        autoClickers++;
        autoClickerSpeed[level]++;  
        document.getElementById("points").innerText = points;
        document.getElementById("autoclickers").innerText = autoClickers;
        alert(`You bought a ${clickerNames[level - 1]}!`);
        saveGame();
    }
}


function buyUpgrade(level) {
    if (points >= upgradePrices[level - 1]) {
        points -= upgradePrices[level - 1];
        if (level === 1) {
            clickPower++; 
        } else if (level === 2) {
            autoClickerSpeed[level - 1]++; 
        } else if (level === 3) {
            clickPower += 2; 
        }
        document.getElementById("points").innerText = points;
        document.getElementById("clickPower").innerText = clickPower;
        alert(`You upgraded ${upgradeNames[level - 1]}!`);
        saveGame();
    }
}


setInterval(() => {
    points += autoClickers * clickerNames.length;  
    document.getElementById("points").innerText = points;
    saveGame();
}, 1000);

document.getElementById("cookie").addEventListener("click", clickCookie);
