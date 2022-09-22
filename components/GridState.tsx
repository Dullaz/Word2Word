import update from 'immutability-helper'

export enum DIRECTION {
    VERTICAL,
    HORIZONTAL,

}
export interface Word {
    text: string;
    solution: string;
    idx: number;
    padding: number;
    direction: DIRECTION
  }
  
  export interface Letter {
    id: number;
    text: string;

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
                text:""
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
                
                const loc = this.letters.at(offset)!;
                if(loc.text != c && loc.text != "") {
                    this.dieOverwrite(loc.text, c, offset);
                }
                loc.text = c;
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
            word.text.split("").forEach((c) => {

                const loc = this.letters.at(offset)!;

                if(loc.text != c && loc.text != "") {
                    this.dieOverwrite(loc.text, c, offset);
                }

                loc.text = c;
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
        return this.letters;
    }

    private dieOverwrite(text: string, c: string, offset: number) {
        throw new Error("attempting to overwrite another letter with a different value!\n" +
        "stored val: " + text + "\n"+
        "current val: " + c + "\n"+
        "index: " + offset.toString() + "\n"+
        "grid: " + this.letters);
    }
}