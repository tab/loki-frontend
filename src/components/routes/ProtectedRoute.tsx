"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CircularProgress, Box } from "@mui/material"

import { useAuth } from "@/context/AuthContext"

export default function ProtectedRoute({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

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
    return <>{children}</>
  }

  return null
}
