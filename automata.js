class Automata {
    //Goals: size, restart
    constructor(game) {
        Object.assign(this, {game});

        this.automata = [];
        this.height = 100;
        this.width = 200;
        this.tickCount = 0;
        this.ticks = 0;
        this.lifeChance = 2;

        //this.speed = parseInt(document.getElementById('speed').value, 10);

        this.buildEmptyStateArray();
        this.insertRandomLife();
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
        let size = 8, gap = 1;
        ctx.fillStyle = "Green";

        for (let col = 0; col < this.width; col++) {
            for (let row = 0; row < this.height; row++) {
                if (this.automata[col][row]) {
                    ctx.fillRect(col * size + gap, row * size + gap, size - 2 * gap, size - 2 * gap);
                }
            }
        }
    }
}