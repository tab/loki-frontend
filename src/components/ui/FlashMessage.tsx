"use client"

import { useEffect, useState } from "react"

import styles from "./FlashMessage.module.css"

interface FlashMessageProps {
  message: string
  type?: "error" | "success" | "info"
  duration?: number // ms
}

export default function FlashMessage({ message, type = "info", duration = 3000 }: FlashMessageProps) {
  const [visible, setVisible] = useState(true)

  const isSuccess = type === "success"

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
    }, duration)
    return () => clearTimeout(timer)
  }, [duration])

  if (!visible) return null

  return (
    <div className={isSuccess ? styles.success : styles.error}>
      {message}
    </div>
  )
}
