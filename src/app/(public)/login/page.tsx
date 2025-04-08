"use client"

import React from "react"
import Link from "next/link"
import { Button, Box, Typography } from "@mui/material"

import i18n from "@/config/i18n"
import Card from "@/components/ui/Card"

export default function LoginPage() {
  return (
    <Box
      sx={{ minHeight: "100vh" }}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="50vh"
      bgcolor="background.default"
      color="text.primary"
    >
      <Card sx={{ padding: 4, maxWidth: 420, width: '100%' }}>
        <Typography variant="h5" gutterBottom align="center">
          {i18n.t("pages.login.title")}
        </Typography>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          mt={2}
        >
          <Link href="/login/smart_id" passHref>
            <Button variant="contained" sx={{ mr: 2 }}>
              {i18n.t("pages.login.providers.smart_id")}
            </Button>
          </Link>
          <Link href="/login/mobile_id" passHref>
            <Button variant="contained">
              {i18n.t("pages.login.providers.mobile_id")}
            </Button>
          </Link>
        </Box>
      </Card>
    </Box>
  )
}
