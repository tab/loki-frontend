"use client"

import React from "react"
import { Box, Typography } from "@mui/material"
import i18n from "@/config/i18n"

export default function LoaderError() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="50vh"
    >
      <Typography variant="h6">{i18n.t("errors.unexpected_error")}</Typography>
    </Box>
  )
}
