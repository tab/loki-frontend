export interface AuthTokensType {
  access_token: string
  refresh_token: string
}

export interface JwtPayloadType {
  exp: number
  jti: string
  roles?: string[]
  permissions?: string[]
  scope?: string[]
}
