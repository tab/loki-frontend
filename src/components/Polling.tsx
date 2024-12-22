"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import i18n from "@/config/i18n"
import { getSessionStatus, finalizeSession } from "@/lib/api/sessions"

interface Props {
  traceId: string
  sessionId: string
  pollingInterval?: number
}

const POLLING_INTERVAL = 2500

export default function Polling({ traceId, sessionId, pollingInterval = POLLING_INTERVAL }: Props) {
  const [status, setStatus] = useState<string>("RUNNING")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    const checkStatus = async () => {
      try {
        const session = await getSessionStatus({ traceId, sessionId })
        setStatus(session.status)
        if (session.status === "ERROR") {
          setError(session.error || i18n.t("errors.unexpected_error"))
          clearInterval(intervalId)
        } else if (session.status === "SUCCESS") {
          clearInterval(intervalId)
          try {
            const user = await finalizeSession({ traceId, sessionId })
            localStorage.setItem("access_token", user.access_token)
            localStorage.setItem("refresh_token", user.refresh_token)

            router.push("/account")
          } catch (finalizeError: any) {
            setError(finalizeError.message)
          }
        }
      } catch (err: any) {
        setError(err.message)
        clearInterval(intervalId)
      }
    }

    intervalId = setInterval(checkStatus, pollingInterval)
    checkStatus()

    return () => {
      clearInterval(intervalId)
    }
  }, [traceId, sessionId, pollingInterval, router])

  if (error) {
    return <div>{error}</div>
  }

  if (status === "RUNNING") {
    return <div>{i18n.t("common.loading")}</div>
  }

  return null
}
