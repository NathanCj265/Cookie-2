class Button {
    constructor(buttonHTMLID) {
        const buttonElement = document.getElementById(buttonHTMLID);
        if (buttonElement) {
            buttonElement.addEventListener("click", () => this.handleClick());
        } else {
            console.error(`Button with ID '${buttonHTMLID}' not found!`);
        }
    }

    handleClick() {
        this.buttonSpecificBehaviour();
    }

    buttonSpecificBehaviour() {
        throw new Error("Not implemented/abstract");
    }
}

class Incr1Button extends Button {
    constructor(buttonHTMLID, game) {
        super(buttonHTMLID);
        this.game = game;
    }

    buttonSpecificBehaviour() {
        this.game.clickCookie();
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
            this.game.updateUI();
            this.game.saveGame();
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
            this.game.updateUI();
            this.game.saveGame();
        } else {
            alert("Not enough points!");
        }
    }
}

class ThemesButton extends Button {
    constructor(buttonHTMLID, themeType, cost, game) {
        super(buttonHTMLID);
        this.themeType = themeType;
        this.cost = cost;
        this.game = game;
    }

    buttonSpecificBehaviour() {
        if (this.game.points >= this.cost) {
            this.game.points -= this.cost;
            this.applyTheme(this.themeType);
            this.game.updateUI();
            this.game.saveGame();
        } else {
            alert("Not enough points!");
        }
    }

    applyTheme(themeType) {
        const theme = this.game.themes[themeType];
        document.body.style.backgroundImage = theme.background;
        document.body.className = theme.color;
    }
}

class CookieClickerGame {
    constructor() {
        this.loadGame();
        this.startAutoClicker();
        this.startClicksPerSecondCounter();
        this.startSpecialEvents();
        this.updateUI();
    }

    saveGame() {
        localStorage.setItem("points", this.points);
        localStorage.setItem("clickPower", this.clickPower);
        localStorage.setItem("clicks", this.clicks);
        localStorage.setItem("clicksPerSecond", this.clicksPerSecond);
        localStorage.setItem("autoClickers", JSON.stringify(this.autoClickers));
        localStorage.setItem("upgrades", JSON.stringify(this.upgrades));
        localStorage.setItem("themes", JSON.stringify(this.themes));
    }

    loadGame() {
        this.points = parseInt(localStorage.getItem("points")) || 0;
        this.clickPower = parseInt(localStorage.getItem("clickPower")) || 1;
        this.clicks = parseInt(localStorage.getItem("clicks")) || 0;
        this.clicksPerSecond = parseInt(localStorage.getItem("clicksPerSecond")) || 0;
        this.autoClickers = JSON.parse(localStorage.getItem("autoClickers")) || {
            cursor: 0,
            grandma: 0,
            bakery: 0,
            factory: 0,
            mine: 0,
            spaceship: 0,
            robot: 0,
            alien: 0
        };
        this.upgrades = JSON.parse(localStorage.getItem("upgrades")) || {
            goldenFingers: { cost: 50, boost: 1 },
            ironCookie: { cost: 250, boost: 5 },
            cookieGod: { cost: 1000, boost: 10 },
            cookieFactory: { cost: 5000, boost: 50 },
            cookieEmpire: { cost: 10000, boost: 100 }
        };
        this.themes = JSON.parse(localStorage.getItem("themes")) || {
            dark: {
                cost: 1000,
                background: "url('img/bg2.jpg')",
                color: "darkTheme"
            },
            light: {
                cost: 2000,
                background: "url('img/bg3.jpg')",
                color: "lightTheme"
            },
            cookie: {
                cost: 3000,
                background: "url('img/bg4.jpg')",
                color: "cookieTheme"
            },
            candy: {
                cost: 4000,
                background: "url('img/bg5.jpg')",
                color: "candyTheme"
            }
        };
    }

    resetGame() {
        this.points = 0;
        this.clickPower = 1;
        this.clicks = 0;
        this.autoClickers = {
            cursor: 0,
            grandma: 0,
            bakery: 0,
            factory: 0,
            mine: 0,
            spaceship: 0,
            robot: 0,
            alien: 0
        };
        this.upgrades = {
            goldenFingers: { cost: 50, boost: 1 },
            ironCookie: { cost: 250, boost: 5 },
            cookieGod: { cost: 1000, boost: 10 },
            cookieFactory: { cost: 5000, boost: 50 },
            cookieEmpire: { cost: 10000, boost: 100 }
        };
        this.themes = {
            dark: {
                cost: 1000,
                background: "url('img/bg2.jpg')",
                color: "darkTheme"
            },
            light: {
                cost: 2000,
                background: "url('img/bg3.jpg')",
                color: "lightTheme"
            },
            cookie: {
                cost: 3000,
                background: "url('img/bg4.jpg')",
                color: "cookieTheme"
            },
            candy: {
                cost: 4000,
                background: "url('img/bg5.jpg')",
                color: "candyTheme"
            }
        };
        this.updateUI();
        this.saveGame();
    }

    clickCookie() {
        this.points += this.clickPower;
        this.clicks += 1;
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

    startClicksPerSecondCounter() {
        setInterval(() => {
            this.clicksPerSecond = this.clicks;
            this.clicks = 0;
            this.updateUI();
        }, 1000);
    }

    startSpecialEvents() {
        setInterval(() => {
            const eventChance = Math.random();
            if (eventChance < 0.1) { // 10% chance for a special event
                this.points += 1000; // Reward for the special event
                alert("Special Event! You earned 1000 points!");
                this.updateUI();
                this.saveGame();
            }
        }, 60000); // Check for special events every 60 seconds
    }

    updateUI() {
        document.getElementById("pointsDisplay").innerText = this.points;
        document.getElementById("clickPower").innerText = this.clickPower;
        document.getElementById("clicks").innerText = this.clicks;
        document.getElementById("clicksPerSecond").innerText = this.clicksPerSecond;

        document.getElementById("autoclickers-0").innerText = `Cursor: ${this.autoClickers.cursor}`;
        document.getElementById("autoclickers-1").innerText = `Grandma: ${this.autoClickers.grandma}`;
        document.getElementById("autoclickers-2").innerText = `Bakery: ${this.autoClickers.bakery}`;
        document.getElementById("autoclickers-3").innerText = `Factory: ${this.autoClickers.factory}`;
        document.getElementById("autoclickers-4").innerText = `Mine: ${this.autoClickers.mine}`;
        document.getElementById("autoclickers-5").innerText = `Spaceship: ${this.autoClickers.spaceship}`;
        document.getElementById("autoclickers-6").innerText = `Robot: ${this.autoClickers.robot}`;
        document.getElementById("autoclickers-7").innerText = `Alien: ${this.autoClickers.alien}`;

        document.getElementById("buyGoldenFingers").innerText = `Golden Fingers (+1 Click Power) ${this.upgrades.goldenFingers.cost} pts`;
        document.getElementById("buyIronCookie").innerText = `Iron Cookie (+5 Click Power) ${this.upgrades.ironCookie.cost} pts`;
        document.getElementById("buyCookieGod").innerText = `Cookie God (+10 Click Power) ${this.upgrades.cookieGod.cost} pts`;
        document.getElementById("buyCookieFactory").innerText = `Cookie Factory (+50 Click Power) ${this.upgrades.cookieFactory.cost} pts`;
        document.getElementById("buyCookieEmpire").innerText = `Cookie Empire (+100 Click Power) ${this.upgrades.cookieEmpire.cost} pts`;

        document.getElementById("buyDark").innerText = `Dark Theme (${this.themes.dark.cost} pts)`;
        document.getElementById("buyLight").innerText = `Light Theme (${this.themes.light.cost} pts)`;
        document.getElementById("buyCookie").innerText = `Cookie Theme (${this.themes.cookie.cost} pts)`;
        document.getElementById("buyCandy").innerText = `Candy Theme (${this.themes.candy.cost} pts)`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const game = new CookieClickerGame();

    new Incr1Button("cookie", game);
    new AutoClickerButton("buyCursor", "cursor", 10, game);
    new AutoClickerButton("buyGrandma", "grandma", 20, game);
    new AutoClickerButton("buyBakery", "bakery", 100, game);
    new AutoClickerButton("buyFactory", "factory", 500, game);
    new AutoClickerButton("buyMine", "mine", 2000, game);
    new AutoClickerButton("buySpaceship", "spaceship", 5000, game);
    new AutoClickerButton("buyRobot", "robot", 10000, game);
    new AutoClickerButton("buyAlien", "alien", 20000, game);

    new UpgradeButton("buyGoldenFingers", "goldenFingers", 50, game);
    new UpgradeButton("buyIronCookie", "ironCookie", 250, game);
    new UpgradeButton("buyCookieGod", "cookieGod", 1000, game);
    new UpgradeButton("buyCookieFactory", "cookieFactory", 5000, game);
    new UpgradeButton("buyCookieEmpire", "cookieEmpire", 10000, game);

    new ThemesButton("buyDark", "dark", 1000, game);
    new ThemesButton("buyLight", "light", 2000, game);
    new ThemesButton("buyCookie", "cookie", 3000, game);
    new ThemesButton("buyCandy", "candy", 4000, game);

    document.getElementById("resetGame").addEventListener("click", () => game.resetGame());
    document.getElementById("saveGame").addEventListener("click", () => game.saveGame());
});