"use client"

import React from "react"
import {
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormHelperText, Box,
} from "@mui/material"

interface Option {
  label: string
  value: string
}

interface CheckboxGroupProps {
  label: string
  name: string
  options: Option[]
  values: string[]
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  error?: boolean
  helperText?: string
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  name,
  options,
  values,
  onChange,
  error = false,
  helperText = ""
}) => {
  return (
    <Box sx={{ display: "flex" }}>
    <FormControl
      sx={{ marginTop: 2, marginBottom: 2 }}
      component="fieldset"
      variant="standard"
      error={error}
    >
      <FormLabel component="legend">{label}</FormLabel>
      <FormGroup>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                name={name}
                value={option.value}
                checked={values.includes(option.value)}
                onChange={onChange}
              />
            }
            label={option.label}
          />
        ))}
      </FormGroup>
      {error && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
    </Box>
  )
}

export default CheckboxGroup
