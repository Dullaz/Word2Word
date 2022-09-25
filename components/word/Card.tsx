import type { Identifier } from 'dnd-core';
import { useEffect, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import styles from '../../styles/Home.module.css';

import { Letter, isDraggable, isDroppable, DIRECTION, LETTER_STATE } from './Definitions';

const ItemTypes = {
  CARD: 'card',
};

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
};

export interface CardProps {
  index: number;
  letter: Letter;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  dragEvent: (dragIndex: number, direction: DIRECTION) => void;
  release: () => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const Card: React.FC<CardProps> = (props) => {
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop<
  DragItem, 
  void, 
  { handlerId: Identifier | null }>({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    drop(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = props.index;

      if(!isDroppable(props.letter.state)){
        return;
      }

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Time to actually perform the action
      props.moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{isDragging}, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id: props.letter.id, index: props.index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: (monitor: any) => {
      return isDraggable(props.letter.state);
    },
  });

  function getStyle(state: LETTER_STATE) {
    switch(state) {
      case(LETTER_STATE.DISABLED): {
        return styles.disabled;
      }
      case(LETTER_STATE.LOCKED): {
        return styles.locked;
      }
      case(LETTER_STATE.SOLVED): {
        return styles.solved;
      }
      default: {
        return '';
      }
    }
  }
  const opacity = isDragging ? 0 : 1;
  const toggledStyle = getStyle(props.letter.state);

  useEffect(() => {
    isDragging ? props.dragEvent(props.index, DIRECTION.VERTICAL) : props.release();
  },[isDragging])

  drag(drop(ref));
  return (
    <div
      ref={ref}
      className={`${styles.card} ${toggledStyle}`}
      style={{ opacity }}
      data-handler-id={handlerId}><span>{props.letter.text}</span></div>
  );
};
