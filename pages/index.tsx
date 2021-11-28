import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>vercel-social-image</h1>
        <p>Demonstrates different ways to generate dynamic images using next deployed to vercel.</p>

        <h2>Generated with canvas</h2>
        <p>
          API <span style={{ fontFamily: 'monospace' }}>/api/canvas/[name].png</span>
        </p>
        <img key="1" width="600px" src="/api/canvas/canving.png" alt="Generated with canvas" />

        <h2>Generated with from SVG</h2>
        <p>
          API <span style={{ fontFamily: 'monospace' }}>/api/svg/[name].png</span>
        </p>
        <img key="2" width="600px" src="/api/svg/svging.png" alt="Generated from SVG" />
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
