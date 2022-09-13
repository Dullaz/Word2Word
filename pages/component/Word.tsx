import React, {useCallback, useState, FC} from "react";

import update from 'immutability-helper'
import styles from '../../styles/Home.module.css'

import Card from './Card'

interface Letter {
  id: number,
  text: string
}

interface WordState {
  letters: Letter[]
}

const checkTarget = (cards: Letter[]) => {
  const target = [3,2,1]
  console.log(cards);
  for(var card of cards) {
    if(card == undefined) return false
    if(card.id != target.pop()) { return false }
  }
  return true
}

function Word() {
  const [cards, setCards] = useState([
    {
      id: 1,
      text: 'A',
    },
    {
      id: 2,
      text: 'B',
    },
    {
      id: 3,
      text: 'C',
    }])

    const [isDone, setIsDone] = useState(false);

    const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
      setCards((prevCards: Letter[]) => 
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex] as Letter],
          ],
        }),
      )

    }, [])

    const renderCard = useCallback(
      (card: { id: number; text: string }, index: number) => {
        return (
          <Card
            key={card.id}
            index={index}
            id={card.id}
            text={card.text}
            moveCard={moveCard}
          />
        )
      },
      [],
    )

    return (
      <><div>
        <h2>{checkTarget(cards) ? "DONE" : ""}</h2>
        <div className={styles.grid}>
          {cards.map((card, i) => renderCard(card, i))}
          </div>
          </div>
      </>
    )
}

export default Word