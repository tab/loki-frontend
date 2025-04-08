export interface UserType {
  id: string
  identity_number: string
  personal_code: string
  first_name: string
  last_name: string
  access_token?: string
  refresh_token?: string
  role_ids?: string[]
  scope_ids?: string[]
}

export interface PaginatedUsersType {
  data: UserType[]
  meta: {
    page: number
    per: number
    total: number
  }
}
