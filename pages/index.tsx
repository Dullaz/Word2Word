import styles from '../styles/Home.module.css';
import type { NextPage } from 'next';

//import { DndProvider } from 'react-dnd';

import Head from 'next/head';
import Image from 'next/image';

import {WordGrid} from '../components/WordGrid';

const Home: NextPage = (data) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Word2Word</title>
        <meta name="description" content="Word2Word App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h2 className={styles.title}>Keep Making Words</h2>
        <p>Drag to rearrange</p>
        <WordGrid/>
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
