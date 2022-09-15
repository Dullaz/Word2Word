import React, { useState, useCallback, useEffect } from 'react';
import update from 'immutability-helper';

import { Card } from './Card';
import styles from '../styles/Home.module.css';

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
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex] as Item],
        ],
      }),
    );
  }, []);

  // check if solution is met

  console.log('STATE: ', solved);

  return (
    <>
      <div className={styles.grid}>
        {cards.map((card, i) => {
          return (
            <Card
              key={card.id}
              index={i}
              id={card.id}
              text={card.text}
              enabled={solved}
              moveCard={moveCard}
            />
          );
        })}
      </div>
    </>
  );
};
