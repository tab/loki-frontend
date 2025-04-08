"use client"

import React from "react"
import { TextField } from "@mui/material"

interface InputProps {
  label: string
  name: string
  value: string
  placeholder?: string
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  onBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
  error?: boolean
  helperText?: string
  type?: string
  fullWidth?: boolean
  margin?: "none" | "dense" | "normal"
}

export default function Input({
  label,
  name,
  value,
  placeholder = "",
  onChange,
  onBlur,
  error = false,
  helperText = "",
  type = "text",
  fullWidth = true,
  margin = "normal",
}: InputProps) {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      type={type}
      fullWidth={fullWidth}
      margin={margin}
      variant="outlined"
    />
  )
}
