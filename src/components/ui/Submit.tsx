"use client"

import React from "react"
import { Button, CircularProgress } from "@mui/material"

interface SubmitProps {
  children: React.ReactNode
  disabled?: boolean
}

export default function Submit({ children, disabled }: SubmitProps) {
  return (
    <Button type="submit" variant="contained" fullWidth disabled={disabled}>
      {disabled ? <CircularProgress size={24} /> : children}
    </Button>
  )
}
