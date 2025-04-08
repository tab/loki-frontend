"use client"

import React from "react"
import { Box, Typography } from "@mui/material"

import i18n from "@/config/i18n"

export default function AboutPage() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      bgcolor="background.default"
      color="text.primary"
      p={3}
    >
      <Typography variant="h4" gutterBottom>
        {i18n.t("pages.about.title")}
      </Typography>
    </Box>
  )
}
