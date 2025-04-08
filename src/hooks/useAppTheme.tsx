"use client"

import React, { createContext, useContext, useState, useMemo, ReactNode, useLayoutEffect } from "react"
import { createTheme, Theme } from "@mui/material/styles"
import { blueGrey, teal, deepPurple, indigo } from "@mui/material/colors"

import ThemeService, { APPEARANCE, APPEARANCE_DARK, APPEARANCE_LIGHT } from "@/lib/theme"

type ThemeContextType = {
  mode: APPEARANCE
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProviderWithToggle = ({ children }: { children: ReactNode }) => {
  const appearance = ThemeService.get()

  const [mode, setMode] = useState<APPEARANCE>(appearance)

  const toggleTheme = () => {
    const newMode: APPEARANCE = mode === APPEARANCE_LIGHT ? APPEARANCE_DARK : APPEARANCE_LIGHT
    setMode(newMode)
    ThemeService.set(newMode)
  }

  const theme: Theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: teal[500],
          },
          secondary: {
            main: teal[700],
          },
          background: {
            default: "var(--background)",
          },
        },
      }),
    [mode]
  )

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
  }, [mode])

  return (
    <ThemeContext.Provider value={{ mode, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useAppTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useAppTheme must be used within a ThemeProviderWithToggle")
  }
  return context
}
