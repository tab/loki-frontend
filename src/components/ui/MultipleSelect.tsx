"use client"

import React from "react"
import { TextField, MenuItem, Box, Chip, SelectChangeEvent, OutlinedInput } from "@mui/material"
import { styled } from "@mui/material/styles"

interface Option {
  label: string
  value: string
}

interface MultipleSelectProps {
  label: string
  name: string
  value: string[]
  onChange: (event: SelectChangeEvent<string[]>) => void
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
  error?: boolean
  helperText?: string
  options: Option[]
  fullWidth?: boolean
  margin?: "none" | "dense" | "normal"
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}))

const MultipleSelect: React.FC<MultipleSelectProps> = ({
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
}) => {

  const renderValue = (selected: string[]) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {selected.map((val) => {
        const option = options.find(opt => opt.value === val);
        return <StyledChip key={val} label={option ? option.label : val} />;
      })}
    </Box>
  )

  return (
    <TextField
      select
      label={label}
      name={name}
      value={value}
      // @ts-ignore
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      margin={margin}
      variant="outlined"
      SelectProps={{
        multiple: true,
        renderValue: renderValue as (selected: unknown) => React.ReactNode,
        MenuProps: MenuProps,
        input: <OutlinedInput id={`${name}-multiple-select`} label={label} />,
      }}
    >
      {options.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
        >
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  )
}

export default MultipleSelect
