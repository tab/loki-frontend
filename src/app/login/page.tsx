"use client"

import Link from "next/link"
import i18n from "@/config/i18n"
import styles from "./page.module.css"

export default function Login() {
  return (
    <div>
      <h5 className={styles.title}>{i18n.t("pages.login.title")}</h5>
      <div className={styles.list}>
        <Link className={styles.item} href="/login/smart_id">
          {i18n.t("pages.login.providers.smart_id")}
        </Link>
        <Link className={styles.item} href="/login/mobile_id">
          {i18n.t("pages.login.providers.mobile_id")}
        </Link>
      </div>
    </div>
  )
}
