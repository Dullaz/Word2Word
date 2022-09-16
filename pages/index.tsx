import styles from '../styles/Home.module.css';
import type { NextPage } from 'next';

import { DndProvider } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch'

import Head from 'next/head';
import Image from 'next/image';

import {WordGrid} from '../components/WordGrid';
import { useEffect } from 'react';

const Home: NextPage = () => {
  var supportsTouch = false;
  if(!typeof window === undefined){
    supportsTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Word2Word</title>
        <meta name="description" content="Word2Word App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Word2Word</h1>
        <DndProvider options={HTML5toTouch}>
          <WordGrid text='ABCDEFGHIJKLMNOP' solution='ABCDEFGHIJKLMONP'/>
        </DndProvider>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
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
