import React, { useState, useCallback, useEffect } from 'react';
import update from 'immutability-helper';

import { Card } from './Card';
import styles from '../styles/Home.module.css';

import { MultiBackend } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch'
import { DndProvider } from 'react-dnd';

export interface Word {
  text: string;
  solution: string;
}

export interface Item {
  id: number;
  text: string;
}

export const WordGrid: React.FC<Word> = ({ text, solution }) => {
  const charArr = text.split('');
  const data: Item[] = [];
  const [cards, setCards] = useState(data);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    let current = cards.map((card, i) => card.text).join('');
    if (current === solution && !solved) {
      setSolved(true);
    }
  }, [cards, solution, solved]);

  charArr.forEach((v, i) => data.push({ id: i, text: v }));

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setCards((prevCards: Item[]) =>
      update(update(prevCards, {
        $splice: [
          [hoverIndex, 1, prevCards[dragIndex] as Item],
        ],
      }), {$splice: [[dragIndex, 1, prevCards[hoverIndex] as Item]]}))
  }, []);

  const isEnabled = (id: number, row: number, column: number, gridSize: number) => {
    id += 1;
    const isColumnEnabled: boolean = id % gridSize == column;
    const isRowEnabled = id > (gridSize * (row-1)) && id <= (gridSize * row);

    return isColumnEnabled || isRowEnabled;
  }

  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
    <h2>{solved ? "Solved!" : ""}</h2>
      <div className={styles.grid}>
        {cards.map((card, i) => {
          return (
            <Card
              key={card.id}
              index={i}
              id={card.id}
              text={card.text}
              enabled={isEnabled(i, 4, 3, 5)}
              moveCard={moveCard}
            />
          );
        })}
      </div>
    </DndProvider>
  );
};
