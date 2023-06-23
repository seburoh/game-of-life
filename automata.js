class Automata {
    //Goals: size, restart, life random
    constructor(game) {
        Object.assign(this, {game});
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

    resetSim() {
        this.automata = [];

        this.cellSize = parseInt(document.getElementById('cellsize').value, 10);
        this.height = Math.floor(800/this.cellSize);
        this.width = Math.floor(1600/this.cellSize);

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
     * Counts live neighbors of given cell.
     * @param {int} cellCol column to check
     * @param {int} cellRow row to check
     */
    countNeighbors(cellCol, cellRow) {
        //if current cell is live, offset start to match.
        let count = this.automata[cellCol][cellRow] == 0 ? 0 : -1;

        for (let col = -1; col < 2; col++) {
            for (let row = -1; row < 2; row++) {
                if ((cellCol + col) > -1 && (cellCol + col) < this.width
                    && (cellRow + row) > -1 && (cellRow + row) < this.height) {
                        count += this.automata[(cellCol + col)][(cellRow + row)];
                    }
            }
        }

        return count;
    }

    /**
     * Logic updates that happen each tick.
     */
    update() {
        this.speed = parseInt(document.getElementById('speed').value, 10);

        if (this.tickCount++ >= this.speed && this.speed != 120) {
            this.tickCount = 0;
            document.getElementById('ticks').innerHTML = 'Ticks: ' + ++this.ticks;

            let next = [];

            //build replacement matrix
            for (let col = 0; col < this.width; col++) {
                next.push([]);
                for (let row = 0; row < this.height; row++) {
                    let count = this.countNeighbors(col,row);
                    if ((count == 3) || (count == 2 && this.automata[col][row] == 1)) {
                        next[col][row] = 1;
                    } else {
                        next[col][row] = 0;
                    }
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