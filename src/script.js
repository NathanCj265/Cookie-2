let actionsTaken = 0;
let totalScore = 0;

class Button {
    constructor(buttonHTMLID) {
        document.getElementById(buttonHTMLID).addEventListener("click", () => this.handleClick());
    }

    handleClick() {
        actionsTaken += 1;
        this.buttonSpecificBehaviour();
        updateScoreDisplay();
    }

    buttonSpecificBehaviour() {
        throw new Error("Not implemented/abstract");
    }
}

class Incr1Button extends Button {
    buttonSpecificBehaviour() {
        totalScore += 1;
        console.log('Cookie clicked: Score increased by 1');
    }
}

class AutoClickerButton extends Button {
    constructor(buttonHTMLID, autoClickerType, cost, game) {
        super(buttonHTMLID);
        this.autoClickerType = autoClickerType;
        this.cost = cost;
        this.game = game;
    }

    buttonSpecificBehaviour() {
        if (this.game.points >= this.cost) {
            this.game.points -= this.cost;
            this.game.autoClickers[this.autoClickerType]++;
            console.log(`${this.autoClickerType} bought!`);
            this.game.updateUI();
        } else {
            alert("Not enough points!");
        }
    }
}

class UpgradeButton extends Button {
    constructor(buttonHTMLID, upgradeType, cost, game) {
        super(buttonHTMLID);
        this.upgradeType = upgradeType;
        this.cost = cost;
        this.game = game;
    }

    buttonSpecificBehaviour() {
        if (this.game.points >= this.cost) {
            this.game.points -= this.cost;
            this.game.clickPower += this.game.upgrades[this.upgradeType].boost;
            console.log(`${this.upgradeType} upgrade purchased!`);
            this.game.updateUI();
        } else {
            alert("Not enough points!");
        }
    }
}


class CookieClickerGame {
    constructor() {
        this.points = parseInt(localStorage.getItem("points")) || 0;
        this.clickPower = parseInt(localStorage.getItem("clickPower")) || 1;
        this.autoClickers = {
            cursor: 0,
            grandma: 0,
            bakery: 0,
            factory: 0,
            mine: 0
        };
        this.upgrades = {
            goldenFingers: { cost: 50, boost: 1 },
            ironCookie: { cost: 250, boost: 5 },
            cookieGod: { cost: 1000, boost: 10 },
            cookieFactory: { cost: 5000, boost: 50 },
            cookieEmpire: { cost: 10000, boost: 100 }
        };
        this.startAutoClicker();
        this.updateUI();
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
            for (let type in this.autoClickers) {
                this.points += this.autoClickers[type];
            }
            this.updateUI();
            this.saveGame();
        }, 1000);
    }

    updateUI() {
        document.getElementById("points").innerText = this.points;
       
        document.getElementById("autoclickers-0").innerText = `Cursor: ${this.autoClickers.cursor}`;
        document.getElementById("autoclickers-1").innerText = `Grandma: ${this.autoClickers.grandma}`;
        document.getElementById("autoclickers-2").innerText = `Bakery: ${this.autoClickers.bakery}`;
        document.getElementById("autoclickers-3").innerText = `Factory: ${this.autoClickers.factory}`;
        document.getElementById("autoclickers-4").innerText = `Mine: ${this.autoClickers.mine}`;

        document.getElementById("upgrade-1").innerText = `Golden Fingers: +1 Click Power (Cost: ${this.upgrades.goldenFingers.cost})`;
        document.getElementById("upgrade-2").innerText = `Iron Cookie: +5 Click Power (Cost: ${this.upgrades.ironCookie.cost})`;
        document.getElementById("upgrade-3").innerText = `Cookie God: +10 Click Power (Cost: ${this.upgrades.cookieGod.cost})`;
        document.getElementById("upgrade-4").innerText = `Cookie Factory: +50 Click Power (Cost: ${this.upgrades.cookieFactory.cost})`;
        document.getElementById("upgrade-5").innerText = `Cookie Empire: +100 Click Power (Cost: ${this.upgrades.cookieEmpire.cost})`;
    }
}


const game = new CookieClickerGame();


document.getElementById("cookie").addEventListener("click", () => game.clickCookie());

new Incr1Button("cookie");  
new AutoClickerButton("buyCursor", "cursor", 10, game);
new AutoClickerButton("buyGrandma", "grandma", 20, game);
new AutoClickerButton("buyBakery", "bakery", 100, game);
new AutoClickerButton("buyFactory", "factory", 500, game);
new AutoClickerButton("buyMine", "mine", 2000, game);

new UpgradeButton("buyGoldenFingers", "goldenFingers", 50, game);
new UpgradeButton("buyIronCookie", "ironCookie", 250, game);
new UpgradeButton("buyCookieGod", "cookieGod", 1000, game);
new UpgradeButton("buyCookieFactory", "cookieFactory", 5000, game);
new UpgradeButton("buyCookieEmpire", "cookieEmpire", 10000, game);