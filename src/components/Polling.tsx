"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Alert, LinearProgress } from "@mui/material"

import i18n from "@/config/i18n"
import { axiosInstance } from "@/lib/axios"
import { useAuth } from "@/context/AuthContext"
import { SessionType } from "@/types/session"
import { UserType } from "@/types/user"

interface Props {
  traceId: string
  sessionId: string
  pollingInterval?: number
}

const POLLING_INTERVAL = 2500

export default function Polling({ traceId, sessionId, pollingInterval = POLLING_INTERVAL }: Props) {
  const router = useRouter()
  const { login } = useAuth()
  const [status, setStatus] = useState<string>("RUNNING")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    const checkStatus = async () => {
      try {
        const response = await axiosInstance.get<SessionType>(`/sessions/${sessionId}`, {
          headers: {
            'X-Trace-ID': traceId
          }
        })
        const session = response.data

        setStatus(session.status)

        if (session.status === "ERROR") {
          setError(session.error || i18n.t("errors.unexpected_error"))
          clearInterval(intervalId)
        } else if (session.status === "SUCCESS") {
          clearInterval(intervalId)
          try {
            const userResponse = await axiosInstance.post<UserType>(`/sessions/${sessionId}`, {}, {
              headers: {
                'X-Trace-ID': traceId
              }
            })
            const userData = userResponse.data

            login(userData, {
              access_token: userData.access_token || "",
              refresh_token: userData.refresh_token || ""
            })
          } catch (finalizeError: any) {
            setError(finalizeError.message || i18n.t("errors.unexpected_error"))
          }
        }
      } catch (err: any) {
        setError(err.message || i18n.t("errors.unexpected_error"))
        clearInterval(intervalId)
      }
    }

    intervalId = setInterval(checkStatus, pollingInterval)
    checkStatus()

    return () => {
      clearInterval(intervalId)
    }
  }, [traceId, sessionId, pollingInterval, router, login])

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  if (status === "RUNNING") {
    return (
      <>
        <LinearProgress color="info" />
        <Alert severity="info">{i18n.t("common.loading")}</Alert>
      </>
    )
  }

  return null
}
