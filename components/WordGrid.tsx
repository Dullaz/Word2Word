import React, { useState, useCallback } from 'react'
import update from 'immutability-helper'

import {Card} from './Card'
import styles from '../styles/Home.module.css';

export interface Word {
    text: string,
    solution: string
}

export interface Item {
    id: number,
    text: string
}

export const WordGrid: React.FC<Word> = (word) => {
    
    const charArr = word.text.split('')
    const data: Item[] = []
    charArr.forEach((v, i) => data.push({id:i,text:v}))

    const [cards, setCards] = useState(data)

    const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
        setCards((prevCards: Item[]) =>
          update(prevCards, {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, prevCards[dragIndex] as Item],
            ],
          }),
        )

      }, [])
    // check if solution is met
    var current = cards.map((card, i) => card.text).join("")
    const [solved, setSolved] = useState(false)
    if(current === word.solution && !solved) {
        setSolved(true);
    }
    console.log("STATE: ", solved)

      const renderCard = useCallback(
        (card: { id: number; text: string }, index: number) => {
          return (
            <Card
              key={card.id}
              index={index}
              id={card.id}
              text={card.text}
              enabled={solved}
              moveCard={moveCard}
            />
          )
        },
        [],
      )

      return (
        <>
          <div className={styles.grid}>{cards.map((card, i) => renderCard(card, i))}</div>
        </>
      )
}