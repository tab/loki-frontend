"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    try {
      const accessToken = localStorage.getItem("access_token")

      if (accessToken) {
        router.push("/account")
      } else {
        router.push("/login")
      }
    } catch (error: any) {
      console.error(error)
    }
  }, [])

  return null
}
