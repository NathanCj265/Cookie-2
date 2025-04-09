class Button {
    constructor(buttonHTMLID) {
        if (new.target === Button) {
            throw new Error("Cannot instantiate abstract class 'Button' directly.");
        }

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

    updateButtonText() {
        const clicker = this.game.autoClickerManager.clickers[this.autoClickerType];
        const buttonElement = document.getElementById(`buy${this.autoClickerType}`);
        if (buttonElement && clicker) {
            buttonElement.innerText = `${clicker.name} (Cost: ${clicker.getPrice()} pts)`;
        }
    }

    buttonSpecificBehaviour() {
        const clicker = this.game.autoClickerManager.clickers[this.autoClickerType];
        if (clicker && this.game.points >= clicker.getPrice()) {
            this.game.points -= clicker.getPrice();
            clicker.buy();
            this.updateButtonText(); 
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
            this.game.updateUI(); 
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
        const theme = this.game.themes[this.themeType];
        if (theme.purchased) {
            this.applyTheme(this.themeType);
        } else if (this.game.points >= this.cost) {
            this.game.points -= this.cost;
            theme.purchased = true;
            this.applyTheme(this.themeType);
            this.game.updateUI(); 
        } else {
            alert("You don't have enough points to buy this theme!");
        }
    }

    applyTheme(themeType) {
        const theme = this.game.themes[themeType];
        if (theme) {
            document.body.style.background = theme.backgroundColor;
            document.body.className = theme.color;
            localStorage.setItem("currentTheme", themeType);
        } else {
            console.error(`Theme '${themeType}' not found!`);
        }
    }
}

class AutoClicker {
    constructor(name, basePrice, cps) {
        this.name = name;
        this.count = 0;
        this.basePrice = basePrice;
        this.cps = cps;
    }

    getPrice() {
        return Math.floor(this.basePrice * Math.pow(1.15, this.count));
    }

    buy() {
        this.count++;
    }

    getProduction() {
        return this.count * this.cps; 
    }
}

class AutoClickerManager {
    constructor() {
        this.clickers = {
            cursor: new AutoClicker('Cursor', 15, 1),       // Cursor CPS = 1
            grandma: new AutoClicker('Grandma', 100, 2),    // Grandma CPS = 2
            bakery: new AutoClicker('Bakery', 500, 3),      // Bakery CPS = 3
            factory: new AutoClicker('Factory', 2000, 4),   // Factory CPS = 4
            mine: new AutoClicker('Mine', 10000, 5),        // Mine CPS = 5
            spaceship: new AutoClicker('Spaceship', 50000, 6), // Spaceship CPS = 6
            robot: new AutoClicker('Robot', 100000, 7),     // Robot CPS = 7
            alien: new AutoClicker('Alien', 1000000, 8)     // Alien CPS = 8
        };
    }

    totalCPS() {
        return Object.values(this.clickers)
            .reduce((sum, clicker) => sum + clicker.getProduction(), 0);
    }

    buyClicker(name, game) {
        const clicker = this.clickers[name];
        if (clicker && game.points >= clicker.getPrice()) {
            game.points -= clicker.getPrice();
            clicker.buy();
            game.updateUI();
        } else {
            alert(`Not enough points to buy ${name}!`);
        }
    }

    getClickerInfo(name) {
        const clicker = this.clickers[name];
        if (clicker) {
            return {
                count: clicker.count,
                price: clicker.getPrice(),
                production: clicker.getProduction()
            };
        }
        return null;
    }
}
class CookieClickerGame {
    constructor() {
        this.points = 0;
        this.clickPower = 1;
        this.clicks = 0;
        this.clicksPerSecond = 0;
        this.autoClickerManager = new AutoClickerManager();
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
                backgroundColor: "#333333",
                color: "darkTheme",
                purchased: false
            },
            cookie: {
                cost: 3000,
                backgroundColor: "#f5deb3",
                color: "cookieTheme",
                purchased: false
            },
            candy: {
                cost: 4000,
                backgroundColor: "#ffcccb",
                color: "candyTheme",
                purchased: false
            },
            chocolate: {
                cost: 5000,
                backgroundColor: "#4b2e2e",
                color: "chocolateTheme",
                purchased: false
            },
            space: {
                cost: 6000,
                backgroundColor: "linear-gradient(135deg, #000033, #1a1a66, #333399)",
                color: "spaceTheme",
                purchased: false
            }
        };
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
        localStorage.setItem("autoClickers", JSON.stringify(this.autoClickerManager.clickers));
        localStorage.setItem("upgrades", JSON.stringify(this.upgrades));
        localStorage.setItem("themes", JSON.stringify(this.themes));

        // Display a popup message
        alert("Game saved!");
    }

    loadGame() {
        this.points = parseInt(localStorage.getItem("points")) || 0;
        this.clickPower = parseInt(localStorage.getItem("clickPower")) || 1;
        this.clicks = parseInt(localStorage.getItem("clicks")) || 0;
        this.clicksPerSecond = parseInt(localStorage.getItem("clicksPerSecond")) || 0;
        const savedAutoClickers = JSON.parse(localStorage.getItem("autoClickers")) || {};
        Object.keys(this.autoClickerManager.clickers).forEach(name => {
            if (savedAutoClickers[name]) {
                const savedClicker = savedAutoClickers[name];
                const clicker = this.autoClickerManager.clickers[name];
                clicker.count = savedClicker.count || 0;
                clicker.basePrice = savedClicker.basePrice || clicker.basePrice;
                clicker.cps = savedClicker.cps || clicker.cps;
            }
        });
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
                backgroundColor: "#333333",
                color: "darkTheme",
                purchased: false
            },
            cookie: {
                cost: 3000,
                backgroundColor: "#f5deb3",
                color: "cookieTheme",
                purchased: false
            },
            candy: {
                cost: 4000,
                backgroundColor: "#ffcccb",
                color: "candyTheme",
                purchased: false
            },
            chocolate: {
                cost: 5000,
                backgroundColor: "#4b2e2e",
                color: "chocolateTheme",
                purchased: false
            },
            space: {
                cost: 6000,
                backgroundColor: "linear-gradient(135deg, #000033, #1a1a66, #333399)",
                color: "spaceTheme",
                purchased: false
            }
        };

        // Apply the saved theme
        const savedTheme = localStorage.getItem("currentTheme");
        if (savedTheme && this.themes[savedTheme]) {
            const theme = this.themes[savedTheme];
            document.body.style.background = theme.backgroundColor;
            document.body.className = theme.color;
        }
    }

    resetGame() {
        this.points = 0;
        this.clickPower = 1;
        this.clicks = 0;
        this.autoClickerManager = new AutoClickerManager();
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
                backgroundColor: "#333333",
                color: "darkTheme",
                purchased: false
            },
            cookie: {
                cost: 3000,
                backgroundColor: "#f5deb3",
                color: "cookieTheme",
                purchased: false
            },
            candy: {
                cost: 4000,
                backgroundColor: "#ffcccb",
                color: "candyTheme",
                purchased: false
            },
            chocolate: {
                cost: 5000,
                backgroundColor: "#4b2e2e",
                color: "chocolateTheme",
                purchased: false
            },
            space: {
                cost: 6000,
                backgroundColor: "linear-gradient(135deg, #000033, #1a1a66, #333399)",
                color: "spaceTheme",
                purchased: false
            }
        };

        document.body.style.background = "#ffffff";
        document.body.className = "";

        localStorage.removeItem("currentTheme");

        this.updateUI();
        this.saveGame();
        alert("Game reset!");
    }

    clickCookie() {
        this.points += this.clickPower;
        this.clicks += 1;
        this.updateUI();
    }

    startAutoClicker() {
        setInterval(() => {
            this.points += Math.floor(this.autoClickerManager.totalCPS()); 
            this.updateUI();
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
            }
        }, 60000); // Check for special events every 60 seconds
    }

    updateUI() {
        document.getElementById("pointsDisplay").innerText = Math.floor(this.points); // Ensure integer display
        document.getElementById("clickPower").innerText = Math.floor(this.clickPower);
        document.getElementById("clicks").innerText = Math.floor(this.clicks);
        document.getElementById("clicksPerSecond").innerText = Math.floor(this.clicksPerSecond);
    
        Object.keys(this.autoClickerManager.clickers).forEach((name, index) => {
            const clickerInfo = this.autoClickerManager.getClickerInfo(name);
            const element = document.getElementById(`autoclickers-${index}`);
            if (element) {
                element.innerText = `${name}: ${clickerInfo.count} (Cost: ${clickerInfo.price} pts, CPS: ${clickerInfo.production})`;
            }
        });

        document.getElementById("buyGoldenFingers").innerText = `Golden Fingers (+1 Click Power) ${this.upgrades.goldenFingers.cost} pts`;
        document.getElementById("buyIronCookie").innerText = `Iron Cookie (+5 Click Power) ${this.upgrades.ironCookie.cost} pts`;
        document.getElementById("buyCookieGod").innerText = `Cookie God (+10 Click Power) ${this.upgrades.cookieGod.cost} pts`;
        document.getElementById("buyCookieFactory").innerText = `Cookie Factory (+50 Click Power) ${this.upgrades.cookieFactory.cost} pts`;
        document.getElementById("buyCookieEmpire").innerText = `Cookie Empire (+100 Click Power) ${this.upgrades.cookieEmpire.cost} pts`;

        if (this.themes.dark) {
            document.getElementById("buyDark").innerText = this.themes.dark.purchased
                ? "Purchased!"
                : `Dark Theme (${this.themes.dark.cost} pts)`;
        }
        if (this.themes.cookie) {
            document.getElementById("buyCookie").innerText = this.themes.cookie.purchased
                ? "Purchased!"
                : `Cookie Theme (${this.themes.cookie.cost} pts)`;
        }
        if (this.themes.candy) {
            document.getElementById("buyCandy").innerText = this.themes.candy.purchased
                ? "Purchased!"
                : `Candy Theme (${this.themes.candy.cost} pts)`;
        }
        if (this.themes.chocolate) {
            document.getElementById("buyChocolate").innerText = this.themes.chocolate.purchased
                ? "Purchased!"
                : `Chocolate Theme (${this.themes.chocolate.cost} pts)`;
        }
        if (this.themes.space) {
            document.getElementById("buySpace").innerText = this.themes.space.purchased
                ? "Purchased!"
                : `Space Theme (${this.themes.space.cost} pts)`;
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const game = new CookieClickerGame();

    new Incr1Button("cookie", game);

    Object.keys(game.autoClickerManager.clickers).forEach((name, index) => {
        const clicker = game.autoClickerManager.clickers[name];
        new AutoClickerButton(`buy${name}`, name, clicker.getPrice(), game);
    });

    new UpgradeButton("buyGoldenFingers", "goldenFingers", 50, game);
    new UpgradeButton("buyIronCookie", "ironCookie", 250, game);
    new UpgradeButton("buyCookieGod", "cookieGod", 1000, game);
    new UpgradeButton("buyCookieFactory", "cookieFactory", 5000, game);
    new UpgradeButton("buyCookieEmpire", "cookieEmpire", 10000, game);

    new ThemesButton("buyDark", "dark", 1000, game);
    new ThemesButton("buyCookie", "cookie", 3000, game);
    new ThemesButton("buyCandy", "candy", 4000, game);
    new ThemesButton("buyChocolate", "chocolate", 5000, game);
    new ThemesButton("buySpace", "space", 6000, game);

    document.getElementById("resetGame").addEventListener("click", () => game.resetGame());
    document.getElementById("saveGame").addEventListener("click", () => game.saveGame());
});