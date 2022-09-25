export enum DIRECTION {
    VERTICAL,
    HORIZONTAL,

}

export enum LETTER_STATE {
    DISABLED, // not in use
    LOCKED, // invalid drop targets
    ENABLED, // enabled for dragging and dropping
    SOLVED, // in correct position

}

export const isDraggable = (state: LETTER_STATE) => {
    return state == LETTER_STATE.ENABLED;
}

export const isDroppable = (state: LETTER_STATE) => {
    return state == LETTER_STATE.ENABLED
}

export interface Word {
    text: string; // shuffled text
    solution: string; // solution
    idx: number; // row or column number
    padding: number; // to shift start position fort short words
    direction: DIRECTION; // Horizontal or Vertical
}
  
  export interface Letter {
    id: number; // letter id == initial location on the grid
    text: string; // letter
    state: LETTER_STATE; // see LETTER_STATE
    parents: Word[]; // word(s) this letter belongs to
}