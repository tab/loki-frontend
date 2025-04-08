export interface RoleType {
  id: string
  name: string
  description: string
  permission_ids?: string[]
}

export interface PaginatedRolesType {
  data: RoleType[]
  meta: {
    page: number
    per: number
    total: number
  }
}
