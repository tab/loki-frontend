"use client"

import i18n from "@/config/i18n"

export default function Loader() {
  return <div>{i18n.t("common.loading")}</div>
}
