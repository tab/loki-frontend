export interface ScopeType {
  id: string
  name: string
  description: string
}

export interface PaginatedScopesType {
  data: ScopeType[]
  meta: {
    page: number
    per: number
    total: number
  }
}
