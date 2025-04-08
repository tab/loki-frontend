export interface PermissionType {
  id: string
  name: string
  description: string
}

export interface PaginatedPermissionsType {
  data: PermissionType[]
  meta: {
    page: number
    per: number
    total: number
  }
}
