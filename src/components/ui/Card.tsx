"use client"

import React from "react"
import { Paper, PaperProps } from "@mui/material"

interface SubmitProps {
  children: React.ReactNode
}

export default function Submit({ children, ...restProps }: SubmitProps & PaperProps) {
  return (
    <Paper elevation={0} {...restProps}>
      {children}
    </Paper>
  )
}
