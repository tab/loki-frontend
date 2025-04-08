"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { axiosInstance } from "@/lib/axios"
import AuthService from "@/lib/auth"
import { UserType } from "@/types/user"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: UserType | null
  roles: string[]
  permissions: string[]
  scope: string[]
  login: (userData: UserType, tokens: { access_token: string; refresh_token: string }) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter()

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [user, setUser] = useState<UserType | null>(null)
  const [roles, setRoles] = useState<string[]>([])
  const [permissions, setPermissions] = useState<string[]>([])
  const [scope, setScope] = useState<string[]>([])

  useEffect(() => {
    const initializeAuth = async () => {
      const { accessToken } = AuthService.get()

      if (accessToken && AuthService.validate(accessToken)) {
        setRoles(AuthService.roles(accessToken))
        setPermissions(AuthService.permissions(accessToken))
        setScope(AuthService.scope(accessToken))

        try {
          const response = await axiosInstance.get<UserType>("/me")

          setUser(response.data)
          setIsAuthenticated(true)
        } catch (error) {
          console.error("Failed to fetch user data:", error)
          reset()
        }
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const reset = () => {
    AuthService.delete()

    setIsAuthenticated(false)
    setUser(null)
    setRoles([])
    setPermissions([])
    setScope([])
  }

  const login = (userData: UserType, tokens: { access_token: string; refresh_token: string }) => {
    AuthService.set(tokens)

    setUser(userData)
    setRoles(AuthService.roles(tokens.access_token))
    setPermissions(AuthService.permissions(tokens.access_token))
    setIsAuthenticated(true)

    router.push("/account")
  }

  const logout = () => {
    reset()
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        roles,
        permissions,
        scope,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
