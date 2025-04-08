"use client"

import React from "react"
import { Typography } from "@mui/material"

interface TitleProps {
  children: React.ReactNode
}

export default function Title({ children }: TitleProps) {
  return (
    <Typography
      variant="h6"
      sx={{
        fontWeight: 700,
        color: "inherit",
        textDecoration: "none",
      }}
    >
      {children}
    </Typography>
  )
}
