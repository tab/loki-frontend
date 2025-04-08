"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CircularProgress, Box } from "@mui/material"
import { useSnackbar } from "notistack"

import i18n from "@/config/i18n"
import { SSO_SERVICE_SCOPE, USER_ROLE_TYPE } from "@/config/rbac"
import { useAuth } from "@/context/AuthContext"

export default function BackofficeProtectedRoute({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const { isAuthenticated, isLoading, roles, scope } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        const hasRequiredRole = roles.some(role => role !== USER_ROLE_TYPE)
        const hasSsoServiceScope = scope.includes(SSO_SERVICE_SCOPE)

        if (!(hasRequiredRole && hasSsoServiceScope)) {
          enqueueSnackbar(i18n.t("errors.forbidden"), { variant: "default" })
          router.push("/account")
        }
      } else {
        router.push("/login")
      }
    }
  }, [isAuthenticated, isLoading, roles, scope, router, enqueueSnackbar])

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    )
  }

  if (isAuthenticated) {
    const hasRequiredRole = roles.some(role => role !== USER_ROLE_TYPE)
    const hasSsoServiceScope = scope.includes(SSO_SERVICE_SCOPE)

    if (hasRequiredRole && hasSsoServiceScope) {
      return <>{children}</>
    }
  }

  return null
}
