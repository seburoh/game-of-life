class Automata {
    constructor(game) {
        Object.assign(this, { game });
        //base parameters do not touch
        this.baseHeight = 100;
        this.baseWidth = 200;
        this.baseCellSize = 8;

        //normal stuff
        this.automata = [];
        this.height = this.baseHeight;
        this.width = this.baseWidth;
        this.cellSize = this.baseCellSize;
        this.tickCount = 0;
        this.ticks = 0;
        this.lifeChance = 2;

        //button
        this.button = document.getElementById('restartButton');
        this.button.addEventListener('click', (e) => {
            this.resetSim();
        });

        //setup
        this.buildEmptyStateArray();
        this.insertRandomLife();
    }

    /**
     * Reset simulation with updated parameters.
     * Called by HTML button.
     */
    resetSim() {
        this.automata = [];

        this.cellSize = parseInt(document.getElementById('cellsize').value, 10);
        this.height = Math.floor(800 / this.cellSize);
        this.width = Math.floor(1600 / this.cellSize);

        this.lifeChance = parseInt(document.getElementById('lifechance').value, 10);

        this.buildEmptyStateArray();
        this.insertRandomLife();

        this.tickCount = 0;
        this.ticks = 0;
    }

    /**
     * Build empty array to required size.
     */
    buildEmptyStateArray() {
        for (let col = 0; col < this.width; col++) {
            this.automata.push([]);
            for (let row = 0; row < this.height; row++) {
                this.automata[col][row] = 0;
            }
        }
    }

    /**
     * Fill existing array with randomized life.
     * Uses this.lifeChance for amount of life to generate.
     */
    insertRandomLife() {
        for (let col = 0; col < this.width; col++) {
            for (let row = 0; row < this.height; row++) {
                this.automata[col][row] = (randomInt(10) < this.lifeChance ? 1 : 0);
            }
        }
    }

    /**
     * Returns if this cell should live or die.
     * @param {int} cellCol column to check
     * @param {int} cellRow row to check
     * @returns true if cell should live
     */
    cellReaper(cellCol, cellRow) {
        let count = 0;

        for (let col = -1; col < 2; col++) {
            for (let row = -1; row < 2; row++) {
                count += this.automata[this.wrapValue(cellCol + col, this.width)]
                                        [this.wrapValue(cellRow + row, this.height)];
            }
        }

        //count includes host square, these numbers account for off by one
        return ((count == 3) || (count == 4 && this.automata[cellCol][cellRow] == 1));
    }

    /**
     * Keeps val within positive mod max.
     * @param {int} val value to mod.
     * @param {int} max modulus or whatever the right term is.
     * @returns absolute value of val mod max
     */
    wrapValue(val, max) {
        return Math.abs(val % max);
    }

    /**
     * Logic updates that happen each tick.
     */
    update() {
        //flip the speed slider so it makes human sense
        let speed = 120 - parseInt(document.getElementById('speed').value, 10);

        if (this.tickCount++ >= speed && speed != 119) {
            this.tickCount = 0;
            document.getElementById('ticks').innerHTML = 'Ticks: ' + ++this.ticks;

            let next = [];

            //build replacement matrix
            for (let col = 0; col < this.width; col++) {
                next.push([]);
                for (let row = 0; row < this.height; row++) {
                    next[col][row] = this.cellReaper(col, row) ? 1 : 0;
                }
            }
            this.automata = next;
        }
    }

    /**
     * Draw new state each tick.
     */
    draw(ctx) {
        let gap = 1;
        ctx.fillStyle = "Green";

        for (let col = 0; col < this.width; col++) {
            for (let row = 0; row < this.height; row++) {
                if (this.automata[col][row]) {
                    ctx.fillRect(col * this.cellSize + gap, row * this.cellSize + gap,
                        this.cellSize - 2 * gap, this.cellSize - 2 * gap);
                }
            }
        }
    }
}