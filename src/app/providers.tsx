"use client"

import React from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { CssBaseline, ThemeProvider } from "@mui/material"
import { SnackbarProvider } from "notistack"

import queryClient from "@/lib/queryClient"
import { ThemeProviderWithToggle, useAppTheme } from "@/hooks/useAppTheme"
import { AuthProvider } from "@/context/AuthContext"

const Providers = ({
  children
}: {
  children: React.ReactNode
}) => {
  const { theme } = useAppTheme()

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            <CssBaseline />
            {children}
          </SnackbarProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProviderWithToggle>
      <Providers>{children}</Providers>
    </ThemeProviderWithToggle>
  )
}
