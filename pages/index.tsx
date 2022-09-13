import type { NextPage } from 'next'

import { DndProvider } from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import {Word} from './component/Letter'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Word2Word</title>
        <meta name="description" content="Word2Word App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Word2Word
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.tsx</code>
        </p>

        <DndProvider backend={HTML5Backend}>
          <Word />
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
  )
}

export default Home
