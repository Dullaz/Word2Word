import React, { useState, useCallback, useEffect } from 'react';
import update from 'immutability-helper';

import { Card } from './Card';
import styles from '../styles/Home.module.css';

import { MultiBackend } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch'
import { DndProvider } from 'react-dnd';

import {IntersectingWords} from '../pages/api/word'

export interface Word {
  text: string;
  solution: string;
  idx: number;
}

export interface Item {
  id: number;
  text: string;
}

const SIZE = 5;

const Shuffle = (text: string) => {
  var a = text.split(""),
      n = a.length;

  for(var i = n - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
  }
  return a.join("");
}

const CopyArr = (oldGrid: Item[][]) => {
  const newGrid: Item[][] = [];
  for(var i=0;i<oldGrid.length;i++) {
    newGrid[i] = [];
    for(var j=0;j<oldGrid[i].length;j++) {
      newGrid[i][j] = oldGrid[i][j];
    }
  }
  return newGrid;
}

export const WordGrid: React.FC = () => {

  const [gridState, setGrid] = useState<Item[][]>();
  useEffect(() => {
    fetch('/api/word')
    .then((res) => res.json())
    .then((data: IntersectingWords) => {

      const grid: Item[][] = [];
      for(var a = 0;a<SIZE;a++) {
        grid[a] = [];
        for(var b=0;b<SIZE;b++) {
          grid[a][b] = {
            id: (b*SIZE) + a,
            text: "disabled"
          };
        }
      }
      data.wordA.split("").forEach((v,i) => {
        const col = data.intersectB;
        const row = i;
        grid[col][row] = {
          id: (SIZE * i) + data.intersectB,
          text: v
        }
      });
      
      data.wordB.split("").forEach((v, i) => {
        const row = data.intersectA;
        const col = i;
        grid[col][row] = {
          id: i + (row * SIZE),
          text: v
        }
      })

      setGrid(grid);
    })
  },[false]);



  const [solved, setSolved] = useState(false);
  

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {

    const dragRow = Math.floor(dragIndex / SIZE);
    const dragCol = dragIndex % SIZE;

    const hoverRow = Math.floor(hoverIndex / SIZE);
    const hoverCol = hoverIndex % SIZE;



    setGrid((prevGrid?: Item[][]) => {
      if(prevGrid == undefined) return;
      const dragItem = prevGrid[dragCol][dragRow];
      const hoverItem = prevGrid[hoverCol][hoverRow];

      const newGrid = CopyArr(prevGrid);
      newGrid[dragCol][dragIndex] = hoverItem;
      prevGrid[hoverCol][hoverIndex] = dragItem;
      console.log(prevGrid, newGrid);
      return newGrid;
    });
  },[]);

  const isEnabled = (item: Item) => {
    return item.text != "disabled";
  }

  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
    <h2>{solved ? "Solved!" : ""}</h2>
      <div className={styles.grid}>
        {gridState?.flat().flat().map((card, i) => {
          return (
            <Card
              key={card.id}
              index={i}
              id={i}
              text={card.text}
              enabled={isEnabled(card)}
              moveCard={moveCard}
            />
          );
        })}
      </div>
    </DndProvider>
  );
}
