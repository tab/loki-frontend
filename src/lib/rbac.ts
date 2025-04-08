import { useAuth } from "@/context/AuthContext"
import {
  ADMIN_ROLE_TYPE,
  PERMISSION_WRITE_PERMISSION,
  ROLE_WRITE_PERMISSION,
  SCOPE_WRITE_PERMISSION,
  TOKEN_WRITE_PERMISSION,
  USER_WRITE_PERMISSION,
} from "@/config/rbac"

export const useRBAC = () => {
  const { roles, permissions, scope } = useAuth()

  const hasRole = (value: string) => roles.includes(value)
  const hasPermission = (value: string) => permissions.includes(value)
  const hasScope = (value: string) => scope.includes(value)

  const isAdmin = hasRole(ADMIN_ROLE_TYPE)

  const canManageUsers = hasPermission(USER_WRITE_PERMISSION)
  const canManageTokens = hasPermission(TOKEN_WRITE_PERMISSION)
  const canManageRoles = hasPermission(ROLE_WRITE_PERMISSION)
  const canManagePermissions = hasPermission(PERMISSION_WRITE_PERMISSION)
  const canManageScopes = hasPermission(SCOPE_WRITE_PERMISSION)

  return {
    isAdmin,
    canManageUsers,
    canManageTokens,
    canManageRoles,
    canManagePermissions,
    canManageScopes,
    hasRole,
    hasPermission,
    hasScope
  }
}
