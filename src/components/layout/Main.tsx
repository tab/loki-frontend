"use client"

import styles from "./Main.module.css"

const Main = ({ children, }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <main className={styles.main}>
      <article className={styles.container}>
        {children}
      </article>
    </main>
  )
}

export default Main
