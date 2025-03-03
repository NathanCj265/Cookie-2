// Game Class
class CookieClicker {
    constructor() {
        this.points = parseInt(localStorage.getItem("points")) || 0;
        this.clickPower = parseInt(localStorage.getItem("clickPower")) || 1;

        this.autoClickers = [
            { name: "Grandma", cost: 20, amount: 0, power: 1 },
            { name: "Bakery", cost: 100, amount: 0, power: 5 },
            { name: "Factory", cost: 500, amount: 0, power: 10 }
        ];

        this.upgrades = [
            { name: "Golden Fingers", cost: 50, power: 1 },
            { name: "Iron Cookie", cost: 250, power: 5 },
            { name: "Cookie God", cost: 1000, power: 10 }
        ];

        this.loadGame();
        this.updateUI();
        this.startAutoClicker();
    }

    // Save Game Data
    saveGame() {
        localStorage.setItem("points", this.points);
        localStorage.setItem("clickPower", this.clickPower);
        localStorage.setItem("autoClickers", JSON.stringify(this.autoClickers));
    }

    // Load Game Data
    loadGame() {
        const storedClickers = JSON.parse(localStorage.getItem("autoClickers"));
        if (storedClickers) this.autoClickers = storedClickers;
    }

    // Clicking the Cookie
    clickCookie() {
        this.points += this.clickPower;
        this.updateUI();
        this.saveGame();
    }

    // Buying AutoClickers
    buyAutoClicker(index) {
        const autoClicker = this.autoClickers[index];

        if (this.points >= autoClicker.cost) {
            this.points -= autoClicker.cost;
            autoClicker.amount++;
            autoClicker.cost = Math.floor(autoClicker.cost * 1.2); // Cost Increases

            this.updateUI();
            this.saveGame();
        } else {
            alert("Not enough points!");
        }
    }

    // Buying Upgrades
    buyUpgrade(index) {
        const upgrade = this.upgrades[index];

        if (this.points >= upgrade.cost) {
            this.points -= upgrade.cost;
            this.clickPower += upgrade.power;
            upgrade.cost = Math.floor(upgrade.cost * 1.5); // Cost Increases

            this.updateUI();
            this.saveGame();
        } else {
            alert("Not enough points!");
        }
    }

    // Auto-Clicker Logic
    startAutoClicker() {
        setInterval(() => {
            let totalAutoClickPower = this.autoClickers.reduce((sum, clicker) => sum + clicker.amount * clicker.power, 0);
            this.points += totalAutoClickPower;
            this.updateUI();
            this.saveGame();
        }, 1000);
    }

    // Update UI Elements
    updateUI() {
        document.getElementById("points").innerText = this.points;

        this.autoClickers.forEach((clicker, index) => {
            document.getElementById(`autoclickers-${index + 1}`).innerText =
                `${clicker.name}: ${clicker.amount} (Cost: ${clicker.cost} pts)`;
        });

        this.upgrades.forEach((upgrade, index) => {
            document.getElementById(`upgrade-${index + 1}`).innerText =
                `${upgrade.name}: +${upgrade.power} Click Power (Cost: ${upgrade.cost} pts)`;
        });
    }
}

// Initialize Game
const game = new CookieClicker();

// Event Listeners
document.getElementById("cookie").addEventListener("click", () => game.clickCookie());
