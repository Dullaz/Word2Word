import styles from '../styles/Home.module.css';
import type { NextPage } from 'next';

import {CgInfinity} from "react-icons/cg";
import {GiSandSnake} from "react-icons/gi";
import {MdOutlineToday} from "react-icons/md"

import Head from 'next/head';
import Image from 'next/image';

import { WordGrid } from '../components/word/variants/WordGrid';
import { CardGame } from '../components/ui/GameCard';

const Home: NextPage = (data) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Word2Word</title>
        <meta name="description" content="Entangled" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h2 className={styles.title}>Entangled</h2>
        <p>Choose mode</p>
        <div className={styles.GameGrid} >
          <CardGame name='Endless' url='game/endless' icon={CgInfinity} />
          <CardGame name='Daily' url='game/daily' icon={MdOutlineToday} />
          <CardGame name='Snake' url='game/snake' icon={GiSandSnake} />

        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer">
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
