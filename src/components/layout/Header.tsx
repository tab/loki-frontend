"use client"

import React, { useState, MouseEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Button,
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Divider, Box,
} from "@mui/material"
import DarkModeIcon from "@mui/icons-material/ContrastSharp"
import LightModeIcon from "@mui/icons-material/LightModeSharp"

import i18n from "@/config/i18n"
import { BACKOFFICE_ALLOWED_ROLES } from "@/config/rbac"
import { useAppTheme } from "@/hooks/useAppTheme"
import { useAuth } from "@/context/AuthContext"
import Avatar from "@/components/ui/Avatar"
import { APPEARANCE_LIGHT } from "@/lib/theme"
import { useRBAC } from "@/lib/rbac"

type HeaderProps = {
  position: "fixed" | "static"
}

const menuItems = [
  {
    text: i18n.t("nav.backoffice"),
    href: "/backoffice",
    roles: BACKOFFICE_ALLOWED_ROLES,
  },
  {
    text: i18n.t("nav.about"),
    href: "/about",
    roles: [],
  },
]

export default function Header({ position }: HeaderProps) {
  const router = useRouter()
  const { mode, toggleTheme } = useAppTheme()
  const { user, logout } = useAuth()
  const { hasRole } = useRBAC()

  const filteredMenuItems = menuItems.filter(({ roles }) =>
    roles.some(role => hasRole(role)) || !roles.length
  )

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleAvatarClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleNavClick = (href: string) => (event: React.MouseEvent) => {
    event.preventDefault()
    window.location.href = href
  }

  const handleAccount = () => {
    router.push("/account")
    handleMenuClose()
  }

  const handleLogout = () => {
    logout()
    handleMenuClose()
  }

  return (
    <AppBar position={position} style={{ zIndex: 1201 }}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".1rem",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          {i18n.t("app.title")}
        </Typography>

        <Box sx={{ flexGrow: 1, ml: 4, mr: 4 }}>
          {filteredMenuItems.map(({text, href}, index) => (
            <Button
              key={index}
              color="inherit"
              component="a"
              href={href}
              onClick={handleNavClick(href)}
            >
              {text}
            </Button>
          ))}
        </Box>

        <Button color="inherit" onClick={toggleTheme}>
          {mode === APPEARANCE_LIGHT ? (
            <DarkModeIcon />
          ) : (
            <LightModeIcon />
          )}
        </Button>

        <Button color="inherit" onClick={() => i18n.changeLanguage("en")}>
          EN
        </Button>

        {user ? (
          <>
            <IconButton
              color="inherit"
              onClick={handleAvatarClick}
              sx={{ ml: 2 }}
            >
              <Avatar
                sx={{
                  margin: "0 auto",
                  fontSize: "1rem",
                  height: 36,
                  width: 36,
                }}
                fullName={`${user.first_name} ${user.last_name}`}
              />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              PaperProps={{
                sx: {
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <MenuItem onClick={handleAccount}>
                {i18n.t("nav.account")}
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                {i18n.t("nav.logout")}
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Link href="/login" passHref>
            <Button color="inherit">{i18n.t("nav.login")}</Button>
          </Link>
        )}
      </Toolbar>
    </AppBar>
  )
}
