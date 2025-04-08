import { jwtDecode } from "jwt-decode"

import { AuthTokensType, JwtPayloadType } from "@/types/auth"

class AuthService {
  get = ()=> {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("access_token")
      const refreshToken = localStorage.getItem("refresh_token")

      return { accessToken, refreshToken }
    }

    return {}
  }
  set = (payload: AuthTokensType) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", payload.access_token)
      localStorage.setItem("refresh_token", payload.refresh_token)
    }
  }
  delete = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
    }
  }
  payload = (accessToken: string) => {
    return jwtDecode<JwtPayloadType>(accessToken)
  }
  validate = (accessToken: string) => {
    const exp = new Date(this.payload(accessToken).exp * 1000)

    return exp && new Date() < exp
  }
  roles = (accessToken: string) => {
    return this.payload(accessToken).roles || []
  }
  permissions = (accessToken: string) => {
    return this.payload(accessToken).permissions || []
  }
  scope = (accessToken: string) => {
    return this.payload(accessToken).scope || []
  }
}

export default new AuthService()
