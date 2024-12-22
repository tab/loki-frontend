"use client"

import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import i18n from "@/config/i18n"
import Loader from "@/components/ui/Loader"
import FlashMessage from "@/components/ui/FlashMessage"

export default function Account() {
  const [user, setUser] = useState<any>(null)
  const [accessTokenPayload, setAccessTokenPayload] = useState<any>(null)
  const [refreshTokenPayload, setRefreshTokenPayload] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token")
    const refreshToken = localStorage.getItem("refresh_token")

    if (!accessToken) {
      setError(i18n.t("errors.unauthorized"))
      setLoading(false)
      return
    }

    async function fetchUser() {
      try {
        const response = await fetch("/api/me", {
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        })
        const data = await response.json()
        if (!response.ok) {
          setError(data.error || i18n.t("errors.unexpected_error"))
        } else {
          setUser(data)

          if (accessToken) {
            setAccessTokenPayload(jwtDecode(accessToken))
          }
          if (refreshToken) {
            setRefreshTokenPayload(jwtDecode(refreshToken))
          }
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) return <Loader />

  if (error) return <FlashMessage message={error} type="error" />

  const handleRefreshToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token")
    if (!refreshToken) {
      setError(i18n.t("errors.unauthorized"))
      return
    }

    try {
      const response = await fetch("/api/tokens/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || i18n.t("errors.unexpected_error"))
      } else {
        localStorage.setItem("access_token", data.access_token)
        localStorage.setItem("refresh_token", data.refresh_token)
        setAccessTokenPayload(jwtDecode(data.access_token))
        setRefreshTokenPayload(jwtDecode(data.refresh_token))
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h5>{i18n.t("pages.account.title")}</h5>
      {user && (
        <>
          <p>
            <strong>{i18n.t("user.identity_number")}: </strong>
            {user.identity_number}
          </p>
          <p>
            <strong>{i18n.t("user.personal_code")}: </strong>
            {user.personal_code}</p>
          <p>
            <strong>{i18n.t("user.first_name")}: </strong>
            {user.first_name}</p>
          <p>
            <strong>{i18n.t("user.last_name")}: </strong>
            {user.last_name}
          </p>

          <hr/>

          {accessTokenPayload && (
            <div>
              <div className="grid">
                <h6>{i18n.t("user.access_token")}</h6>
                <span>{new Date(accessTokenPayload.exp * 1000).toLocaleString("de-DE")}</span>
                <button className="secondary" onClick={handleRefreshToken}>{i18n.t("common.refresh")}</button>
              </div>
              <pre>{JSON.stringify(accessTokenPayload, null, 2)}</pre>
            </div>
          )}

          <hr />

          {refreshTokenPayload && (
            <div>
              <div className="grid">
                <h6>{i18n.t("user.refresh_token")}</h6>
                <span>{new Date(refreshTokenPayload.exp * 1000).toLocaleString("de-DE")}</span>
              </div>
              <pre>{JSON.stringify(refreshTokenPayload, null, 2)}</pre>
            </div>
          )}
        </>
      )}
    </div>
  )
}
