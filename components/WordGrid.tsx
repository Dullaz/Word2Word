import React, { useState, useCallback, useEffect } from 'react';
import update from 'immutability-helper';

import { Card } from './Card';
import styles from '../styles/Home.module.css';

import { MultiBackend } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch'
import { DndProvider } from 'react-dnd';

import {GridState, Word, Letter, DIRECTION} from "./GridState"
import { Shuffle } from './Utility';

const SIZE = 5;

export const WordGrid: React.FC = (() => {

  const gridState = new GridState(SIZE);

  const [grid, setGrid] = useState<Letter[]>();

  useEffect(() => {

    fetch("/api/word")
    .then((res) => res.json())
    .then((data) => {
      const wordA: Word = {
        text: Shuffle(data.wordA, [data.intersectA]),
        solution: data.wordA,
        idx: data.intersectB,
        padding: 0,
        direction: DIRECTION.VERTICAL
      }
    
      const wordB: Word = {
        text: Shuffle(data.wordB, [data.intersectB]),
        solution: data.wordB,
        idx: data.intersectA,
        padding: 0,
        direction: DIRECTION.HORIZONTAL
      }

    gridState.init([wordA, wordB])
    setGrid(gridState.get());

    });
  },[]);

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {

    gridState.swap(hoverIndex, dragIndex);
    setGrid(gridState.get());

  },[]);

  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <div className={styles.grid}>
        {grid?.map((card, i) => {
          return (
            <Card
              key={card.id}
              index={i}
              id={i}
              text={card.text}
              enabled={card.enabled}
              moveCard={moveCard}
              locked={card.locked}
            />
          );
        })}
      </div>
    </DndProvider>
  );
});
