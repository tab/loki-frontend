"use client"

import React from "react"
import { Box, Typography, CardContent, Grid, Divider } from "@mui/material"
import PersonIcon from "@mui/icons-material/Person"
import BadgeIcon from "@mui/icons-material/Badge"
import KeyIcon from "@mui/icons-material/Key"
import Card from "@/components/ui/Card"
import Avatar from "@/components/ui/Avatar"

import i18n from "@/config/i18n"
import { useAuth } from "@/context/AuthContext"

export default function AccountPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <Typography variant="h6">{i18n.t("common.loading")}</Typography>
      </Box>
    )
  }

  if (!user) {
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

  const fullName = `${user.first_name} ${user.last_name}`

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
        {i18n.t("pages.account.title")}
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {i18n.t("pages.account.welcome", { name: fullName })}
      </Typography>

      <Card sx={{ maxWidth: "85%", width: "100%", mt: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4} md={3}>
              <Avatar
                sx={{
                  margin: "0 auto",
                  fontSize: "2.25rem",
                  height: 96,
                  width: 96,
                }}
                fullName={fullName}
              />
            </Grid>

            <Grid item xs={12} sm={8} md={9}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h5">
                    {i18n.t("pages.account.info")}
                  </Typography>
                </Grid>

                <Divider sx={{ width: "100%", my: 1 }} />

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <KeyIcon sx={{ mr: 1, color: "text.secondary" }} />
                    <Typography variant="subtitle1" color="text.secondary">
                      {i18n.t("user.id")}:
                    </Typography>
                  </Box>
                  <Typography variant="body1">{user.id}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <BadgeIcon sx={{ mr: 1, color: "text.secondary" }} />
                    <Typography variant="subtitle1" color="text.secondary">
                      {i18n.t("user.identity_number")}:
                    </Typography>
                  </Box>
                  <Typography variant="body1">{user.identity_number}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />
                    <Typography variant="subtitle1" color="text.secondary">
                      {i18n.t("user.full_name")}:
                    </Typography>
                  </Box>
                  <Typography variant="body1">{fullName}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <BadgeIcon sx={{ mr: 1, color: "text.secondary" }} />
                    <Typography variant="subtitle1" color="text.secondary">
                      {i18n.t("user.personal_code")}:
                    </Typography>
                  </Box>
                  <Typography variant="body1">{user.personal_code}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}
