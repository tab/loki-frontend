"use client"

import React from "react"
import { Avatar, AvatarProps } from "@mui/material"

interface UserAvatarProps extends AvatarProps {
  fullName: string
}

function stringToColor(string: string) {
  let hash = 0
  let i

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = "#"

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }
  /* eslint-enable no-bitwise */

  return color
}

function getInitials(name: string) {
  const nameParts = name.trim().split(" ")
  if (nameParts.length === 0) return "U"
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase()
  return (
    nameParts[0].charAt(0).toUpperCase() +
    nameParts[nameParts.length - 1].charAt(0).toUpperCase()
  )
}

const UserAvatar: React.FC<UserAvatarProps> = ({ fullName, ...props }) => {
  return (
    <Avatar
      sx={{
        bgcolor: stringToColor(fullName),
        ...props.sx,
      }}
      {...props}
    >
      {getInitials(fullName)}
    </Avatar>
  )
}

export default UserAvatar
