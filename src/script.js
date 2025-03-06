class CookieClickerGame {
    constructor() {
        this.points = parseInt(localStorage.getItem("points")) || 0;
        this.autoClickers = new AutoClickers();
        this.upgrades = new Upgrades();
        this.clickPower = parseInt(localStorage.getItem("clickPower")) || 1;

        this.updateUI();
        this.startAutoClicker();
    }

    
    saveGame() {
        localStorage.setItem("points", this.points);
        localStorage.setItem("clickPower", this.clickPower);
        localStorage.setItem("autoClickers", JSON.stringify(this.autoClickers));
        localStorage.setItem("upgrades", JSON.stringify(this.upgrades));
    }

    clickCookie() {
        this.points += this.clickPower;
        this.updateUI();
        this.saveGame();
    }

    
    startAutoClicker() {
        setInterval(() => {
            this.autoClickers.applyAutoClickers(this);
            this.updateUI();
            this.saveGame();
        }, 1000); 
    }

   
    updateUI() {
        document.getElementById("points").innerText = this.points;
        this.autoClickers.updateUI();
        this.upgrades.updateUI();
    }
}


class AutoClickers {
    constructor() {
        this.autoClickers = {
            cursor: 0,
            grandma: 0,
            bakery: 0,
            factory: 0,
            mine: 0
        };
    }

    buyAutoClicker(type, game) {
        let cost = this.calculateCost(type);

        if (game.points >= cost) {
            game.points -= cost;
            this.autoClickers[type]++;
            game.updateUI();
            game.saveGame();
        } else {
            alert("Not enough points!");
        }
    }

    
    calculateCost(type) {
        let cost = 0;
        switch (type) {

            case "cursor":
                cost = 10 + this.autoClickers.cursor * 5;
                break;
            case "grandma":
                cost = 20 + this.autoClickers.grandma * 10;
                break;
            case "bakery":
                cost = 100 + this.autoClickers.bakery * 50;
                break;
            case "factory":
                cost = 500 + this.autoClickers.factory * 100;
                break;
            case "mine":
                cost = 2000 + this.autoClickers.mine * 500;
                break; 
        }
        return cost;
    }

   
    applyAutoClickers(game) {
        for (const key in this.autoClickers) {
            game.points += this.autoClickers[key];
        }
    }

    updateUI() {
        document.getElementById("autoclickers-2").innerText = `Cursor: ${this.autoClickers.cursor} (Cost: ${10 + this.autoClickers.cursor * 5} pts)`;
        document.getElementById("autoclickers-2").innerText = `Grandma: ${this.autoClickers.grandma} (Cost: ${20 + this.autoClickers.grandma * 10} pts)`;
        document.getElementById("autoclickers-3").innerText = `Bakery: ${this.autoClickers.bakery} (Cost: ${100 + this.autoClickers.bakery * 50} pts)`;
        document.getElementById("autoclickers-4").innerText = `Factory: ${this.autoClickers.factory} (Cost: ${500 + this.autoClickers.factory * 100} pts)`;
        document.getElementById("autoclickers-2").innerText = `Grandma: ${this.autoClickers.mine} (Cost: ${2000 + this.autoClickers.mine * 500} pts)`;
    }

}


class Upgrades {
    constructor() {
        this.upgrades = {
            goldenFingers: { cost: 50, boost: 1 },
            ironCookie: { cost: 250, boost: 5 },
            cookieGod: { cost: 1000, boost: 10 }
        };
    }

    
    buyUpgrade(type, game) {
        const upgrade = this.upgrades[type];

        if (game.points >= upgrade.cost) {
            game.points -= upgrade.cost;
            game.clickPower += upgrade.boost;
            game.updateUI();
            game.saveGame();
        } else {
            alert("Not enough points!");
        }
    }

    
    updateUI() {
        document.getElementById("upgrade-1").innerText = `Golden Fingers: +1 Click Power (Cost: ${this.upgrades.goldenFingers.cost} pts)`;
        document.getElementById("upgrade-2").innerText = `Iron Cookie: +5 Click Power (Cost: ${this.upgrades.ironCookie.cost} pts)`;
        document.getElementById("upgrade-3").innerText = `Cookie God: +10 Click Power (Cost: ${this.upgrades.cookieGod.cost} pts)`;
    }
}


const game = new CookieClickerGame();

document.getElementById("cookie").addEventListener("click", () => game.clickCookie());


document.getElementById("buyGrandma").addEventListener("click", () => game.autoClickers.buyAutoClicker("grandma", game));
document.getElementById("buyBakery").addEventListener("click", () => game.autoClickers.buyAutoClicker("bakery", game));
document.getElementById("buyFactory").addEventListener("click", () => game.autoClickers.buyAutoClicker("factory", game));

document.getElementById("buyGoldenFingers").addEventListener("click", () => game.upgrades.buyUpgrade("goldenFingers", game));
document.getElementById("buyIronCookie").addEventListener("click", () => game.upgrades.buyUpgrade("ironCookie", game));
document.getElementById("buyCookieGod").addEventListener("click", () => game.upgrades.buyUpgrade("cookieGod", game));

