import { IconType } from "react-icons";
import styles from '../../styles/Home.module.css';
import Link from 'next/link';


export interface CardGameProps {
    name: string;
    url: string;
    icon: IconType;
}

export const CardGame: React.FC<CardGameProps> = (props) => {

    return (
        <Link href={props.url}>
            <div className={styles.GameCard} onClick={() => console.log("click")}>
                <h3>{props.name}</h3>
                <props.icon size="6em"/>
            </div>
        </Link>
    )
} 