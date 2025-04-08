"use client"

import React from "react"
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
} from "@mui/material"
import Link from "next/link"

import SecurityIcon from "@mui/icons-material/SecuritySharp"
import PeopleIcon from "@mui/icons-material/PeopleOutlineSharp"
import BlurOnIcon from "@mui/icons-material/BlurOnSharp"
import KeyIcon from "@mui/icons-material/KeySharp"

import i18n from "@/config/i18n"
import { useRBAC } from "@/lib/rbac"

const drawerWidth = 240

const primaryMenuItems = [
  {
    text: i18n.t("pages.backoffice.users.title"),
    href: "/backoffice/users",
    icon: <PeopleIcon />,
    permissions: ["read:users"],
  },
  {
    text: i18n.t("pages.backoffice.tokens.title"),
    href: "/backoffice/tokens",
    icon: <KeyIcon />,
    permissions: ["read:tokens"],
  },
]

const secondaryMenuItems = [
  {
    text: i18n.t("pages.backoffice.permissions.title"),
    href: "/backoffice/permissions",
    icon: <SecurityIcon />,
    permissions: ["read:permissions"],
  },
  {
    text: i18n.t("pages.backoffice.roles.title"),
    href: "/backoffice/roles",
    icon: <PeopleIcon />,
    permissions: ["read:roles"],
  },
  {
    text: i18n.t("pages.backoffice.scopes.title"),
    href: "/backoffice/scopes",
    icon: <BlurOnIcon />,
    permissions: ["read:scopes"],
  },
]

const Aside: React.FC = () => {
  const { hasPermission } = useRBAC()

  const filteredPrimaryMenuItems = primaryMenuItems.filter(({ permissions }) =>
    permissions.every(permission => hasPermission(permission))
  )
  const filteredSecondaryMenuItems = secondaryMenuItems.filter(({ permissions }) =>
    permissions.every(permission => hasPermission(permission))
  )

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />

      <List>
        {filteredPrimaryMenuItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton href={item.href} component={Link}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        {filteredSecondaryMenuItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton href={item.href} component={Link}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}

export default Aside
