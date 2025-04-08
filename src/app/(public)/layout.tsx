"use client"

import React from "react"
import Link from "next/link"
import { Button, AppBar, Toolbar, Typography } from "@mui/material"
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined"
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined"

import i18n from "@/config/i18n"
import { useAppTheme } from "@/hooks/useAppTheme"
import Header from "@/components/layout/Header"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { mode, toggleTheme } = useAppTheme()

  const handleLanguageChange = () => {
    i18n.changeLanguage("en")
  };

  return (
    <>
      <Header position="fixed" />
      <main>{children}</main>
    </>
  )
}
