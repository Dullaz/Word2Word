import update from 'immutability-helper'

export enum DIRECTION {
    VERTICAL,
    HORIZONTAL,

}

export enum LETTER_STATE {
    DISABLED,
    LOCKED,
    ENABLED,
}
export interface Word {
    text: string;
    solution: string;
    idx: number;
    padding: number;
    direction: DIRECTION;
  }
  
  export interface Letter {
    id: number;
    text: string;
    state: LETTER_STATE;
    parents: Word[];
  }

export class GridState {
    private gridSize: number;
    private letters: Letter[];

    constructor(gridSize: number) {
        this.gridSize = gridSize;
        this.letters = [];
    }
    private emptyGrid() {
        for(var i=0;i<Math.pow(this.gridSize,2);i++) {
            this.letters[i] = {
                id:i,
                text:"",
                state: LETTER_STATE.DISABLED,
                parents: []
            }
        }
    }
    private _updateState(word: Word, c: string, offset: number) {

        const loc = this.letters.at(offset)!;

        switch(loc.state) {
            case LETTER_STATE.DISABLED: {
                // update
                loc.text = c;
                loc.state = LETTER_STATE.ENABLED;
                loc.parents.push(word);
                break;
            }
            case LETTER_STATE.ENABLED: {
                // check x-over
                if(loc.text != c) {
                    this.dieOverwrite(loc.text, c, offset);
                }
                loc.parents.push(word);
                loc.state = LETTER_STATE.LOCKED;
                break;
            }
            default: {
                throw new Error("weird state: " + loc.state + " " + loc.text + " " + c);
            }
        }
    }
    public init(words:Word[]) {

        this.emptyGrid();

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

    public swap(a: number, b:number) {

        this.letters = update(this.letters, {
            $splice: [
                [a, 1, this.letters[b]],
                [b, 1, this.letters[a]]
            ]
        })
    }

    public get(): Letter[] {
        return [...this.letters];
    }

    public lock(dragIndex: number, direction: DIRECTION) {

        const parent = this.letters[dragIndex].parents[0];
        this.letters.forEach((l) => {
            
            if (l.state == LETTER_STATE.DISABLED) {
                return;
            } else if(l.parents.includes(parent) && l.parents.length == 1) {
                l.state = LETTER_STATE.ENABLED;
            }
            else { 
                l.state = LETTER_STATE.LOCKED 
            }
        })
    }

    public unlock() {
        this.letters
            .filter((l) => l.state != LETTER_STATE.DISABLED)
            .forEach((l) => {
                if(l.parents.length == 1) {
                    l.state = LETTER_STATE.ENABLED;
                }
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