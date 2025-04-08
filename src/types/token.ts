export interface TokenType {
  id: string
  user_id: string
  type: string
  value: string
  expires_at: string
}

export interface PaginatedTokensType {
  data: TokenType[]
  meta: {
    page: number
    per: number
    total: number
  }
}
