import React, { useState, useCallback, useEffect } from 'react';
import { Card } from '../Card';
import styles from '../../../styles/Home.module.css';

import { MultiBackend } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch'
import { DndProvider } from 'react-dnd';

import {BaseGridState} from '../base/BaseGridState'
import { Letter } from '../Definitions';

const SIZE = 5;

export const EndlessGrid: React.FC = (() => {

  const gridState = new BaseGridState(SIZE);

  const [grid, setGrid] = useState<Letter[]>();

  useEffect(() => {
    fetch("/api/word")
    .then((res) => res.json())
    .then((data) => {
      gridState.init(data);
      setGrid(gridState.get());
    });
  },[]);

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {

    gridState.swap(hoverIndex, dragIndex);
    gridState.checkSolution();
    setGrid(gridState.get());

  },[]);

  const dragEvent = useCallback((dragIndex: number) => {

    gridState.lock(dragIndex);
    setGrid(gridState.get());
  },[]);

  const release = useCallback(() => {

    gridState.unlock();
    setGrid(gridState.get());
  },[])

  
  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <div className={styles.grid}>
        {grid?.map((card, i) => {
          return (
            <Card
              key={card.id}
              index={i}
              letter={card}
              moveCard={moveCard}
              dragEvent={dragEvent}
              release={release}
            />
          );
        })}
      </div>
    </DndProvider>
  );
});
