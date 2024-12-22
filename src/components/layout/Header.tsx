"use client"

import { useEffect, useState } from "react"
import i18n from "@/config/i18n"
import Link from "next/link"
import styles from "./Header.module.css"

export default function Header() {
  const [isLoggedIn, setLoggedIn] = useState<any>(false)

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token")
    if (accessToken) {
      setLoggedIn(true)
    } else {
      setLoggedIn(false)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    setLoggedIn(false)
  }

  return (
    <nav className={styles.container}>
      <ul>
        <li>
          <strong>
            <Link href="/">{i18n.t("app.title")}</Link>
          </strong>
        </li>
      </ul>
      <ul>
        {isLoggedIn ? (
          <>
            <li>
              <Link href="/account">{i18n.t("nav.account")}</Link>
            </li>
            <li>
              <Link href="/" onClick={handleLogout}>{i18n.t("nav.logout")}</Link>
            </li>
          </>
        ) : (
          <li>
            <Link href="/login">{i18n.t("nav.login")}</Link>
          </li>
        )}
      </ul>
    </nav>
  )
}
