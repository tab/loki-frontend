"use client"

import React from "react"
import { TextField, MenuItem } from "@mui/material"

interface Option {
  label: string
  value: string
}

interface SelectFieldProps {
  label: string
  name: string
  value: string
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  onBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
  error?: boolean
  helperText?: string
  options: Option[]
  fullWidth?: boolean
  margin?: "none" | "dense" | "normal"
}

export default function SelectField({
  label,
  name,
  value,
  onChange,
  onBlur,
  error = false,
  helperText = "",
  options,
  fullWidth = true,
  margin = "normal",
}: SelectFieldProps) {
  return (
    <TextField
      select
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      margin={margin}
      variant="outlined"
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  )
}
