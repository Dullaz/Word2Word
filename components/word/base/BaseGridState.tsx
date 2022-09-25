import update from 'immutability-helper'

import {Word, Letter, LETTER_STATE, DIRECTION} from '../Definitions'

export class BaseGridState {
    protected gridSize: number;
    protected letters: Letter[];
    protected words: Word[] = [];

    constructor(gridSize: number) {
        this.gridSize = gridSize;
        this.letters = [];
    }

    /**
     * Clear the grid and set all letters to disabled
     */
    private emptyGrid() {
        for(var i=0;i<Math.pow(this.gridSize,2);i++) {
            this.letters[i] = {
                id:i,
                text:"",
                state: LETTER_STATE.DISABLED,
                parents: [],
            }
        }
    }

    /**
     * Initialize the grid with an array of words
     */
    public init(words:Word[]) {

        this.emptyGrid();
        this.words = words;

        words.forEach((w) => {console.log(w)})
        
        // do horizontal words first
        words.forEach((word) => {
            if(word.direction != DIRECTION.HORIZONTAL) {
                return;
            }
            //get offset
            var offset = (word.idx * this.gridSize) + word.padding;
            word.text.split("").forEach((c: string) => {
                
                this._updateState(word, c, offset);
                offset++;
            });
        });

        // do vertical
        words.forEach((word) => {
            if(word.direction != DIRECTION.VERTICAL) {
                return;
            }
            // get offset
            var offset = word.idx + word.padding;
            word.text.split("").forEach((c: string) => {
                
                this._updateState(word, c, offset);
                offset += this.gridSize;
            });
        });
    }

    private _updateState(word: Word, c: string, offset: number) {

        const loc = this.letters.at(offset)!;

        switch(loc.state) {

            // Letter is disabled, so just enable it
            case LETTER_STATE.DISABLED: {
                // update
                loc.text = c;
                loc.state = LETTER_STATE.ENABLED;
                loc.parents.push(word);
                break;
            }

            // Letter is already enabled, ensure that it intersects
            case LETTER_STATE.ENABLED: {
                // check x-over
                if(loc.text != c) {
                    this.dieOverwrite(loc.text, c, offset);
                }
                loc.parents.push(word);
                loc.state = LETTER_STATE.SOLVED;
                break;
            }

            // Any other state should never happen, so die if it does
            default: {
                throw new Error("weird state: " + loc.state + " " + loc.text + " " + c);
            }
        }
    }

    // Swap two letters around
    public swap(a: number, b:number) {

        this.letters = update(this.letters, {
            $splice: [
                [a, 1, this.letters[b]],
                [b, 1, this.letters[a]]
            ]
        })
    }

    // For each word, check if it has been solved
    public checkSolution() {
        this.words.forEach((word) => {

            const letters = this.slice(word);
            console.log(letters)
            const attempt = letters.map((l) => l.text).join("");
            console.log(attempt);
            if(attempt == word.solution) {
                letters.forEach((letter) => {
                    letter.state = LETTER_STATE.SOLVED;
                })
            }
        })
    }

    private slice(word: Word) {
        const start = (word.direction == DIRECTION.HORIZONTAL ? word.idx * this.gridSize : word.idx) + word.padding;
        const step = word.direction == DIRECTION.HORIZONTAL ? 1 : this.gridSize -1;
        const end = start + (word.text.length * step);

        console.log(start, step, end, word);
        if(word.direction == DIRECTION.HORIZONTAL) {
            return this.letters.slice(start, end);
        }

        const sliced: Letter[] = [];
        for(var i=start;i<=end;i += this.gridSize) {
            sliced.push(this.letters[i]);
        }
        return sliced;
    }

    public getSolved(): Word[] {
        const solvedWords: Word[] = [];
        this.words.forEach((word) => {
            const start = (word.direction == DIRECTION.HORIZONTAL ? word.idx * this.gridSize : word.idx) + word.padding;
            const end = start + word.text.length

            const letters = this.letters.slice(start, end);
            if(letters.join("") == word.solution) {
                solvedWords.push(word);
            }
        });
        return solvedWords;
    }

    // Get the letters
    public get(): Letter[] {
        return [...this.letters];
    }

    public deleteWord(word: Word) {
        if(this.words.includes(word)) {
            this.letters.forEach((l) => {
                if(l.parents.includes(word)) {
                    l.state = LETTER_STATE.DISABLED;
                    l.parents = []
                    l.text = ""
                }
            });
            this.words.splice(this.words.indexOf(word), 1);
        }
    }

    // Lock out word based on the letter being dragged
    public lock(dragIndex: number) {

        const parent = this.letters[dragIndex].parents[0];
        this.letters.forEach((l) => {
            
            if (l.state == LETTER_STATE.DISABLED) {
                return;
            } else if(l.parents.includes(parent) && l.parents.length == 1) {
                l.state = LETTER_STATE.ENABLED;
            }
            else if(l.parents.length == 1) {
                l.state = LETTER_STATE.LOCKED
            }
        })
    }

    // Unlock a row or column
    public unlock() {
        this.letters
            .filter((l) => l.state != LETTER_STATE.DISABLED)
            .filter((l) => l.state != LETTER_STATE.SOLVED)
            .forEach((l) => {
                l.state = LETTER_STATE.ENABLED;
        });
    }

    private dieOverwrite(text: string, c: string, offset: number) {
        throw new Error("attempting to overwrite another letter with a different value!\n" +
        "stored val: " + text + "\n"+
        "current val: " + c + "\n"+
        "index: " + offset.toString() + "\n"+
        "grid: " + this.letters);
    }
}