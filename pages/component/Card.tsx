import type { Identifier, XYCoord } from 'dnd-core'
import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import styles from '../../styles/Home.module.css'


const ItemTypes = {
    CARD: 'card',
  }

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
}

export interface CardProps {
  id: any
  text: string
  index: number
  moveCard: (dragIndex: number, hoverIndex: number) => void
}

interface DragItem {
  index: number
  id: string
  type: string
}

function Card(props: CardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null}>({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = props.index

      if (dragIndex === hoverIndex) {
        return
      }
      
      props.moveCard(dragIndex, hoverIndex)

      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return {id: props.id, text: props.text}
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))
  return (
    <div ref={ref} style={{ opacity }} data-handler-id={handlerId} className={styles.card}>
      <h2>{props.text}</h2>
    </div>
  )
}

export default Card