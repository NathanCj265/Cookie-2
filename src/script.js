let points = parseInt(localStorage.getItem("points")) || 0;
let autoClickers = parseInt(localStorage.getItem("autoClickers")) || 0;
let clickPower = parseInt(localStorage.getItem("clickPower")) || 1;

document.getElementById("points").innerText = points;
document.getElementById("autoclickers").innerText = autoClickers;
document.getElementById("clickPower").innerText = clickPower;

function saveGame() {
    localStorage.setItem("points", points);
    localStorage.setItem("autoClickers", autoClickers);
    localStorage.setItem("clickPower", clickPower);
}

function clickCookie() {
    points += clickPower;
    document.getElementById("points").innerText = points;
    saveGame();
}

function buyAutoClicker() {
    if (points >= 10) {
        points -= 10;
        autoClickers++;
        document.getElementById("points").innerText = points;
        document.getElementById("autoclickers").innerText = autoClickers;
        saveGame();
    }
}

function buyUpgrade() {
    if (points >= 50) {
        points -= 50;
        clickPower++;
        document.getElementById("points").innerText = points;
        document.getElementById("clickPower").innerText = clickPower;
        saveGame();
    }
}


setInterval(() => {
    points += autoClickers;
    document.getElementById("points").innerText = points;
    saveGame();
}, 1000);

document.getElementById("cookie").addEventListener("click", clickCookie);
