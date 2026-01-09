export interface Collateral {
  id: number
  product_id: number
  product_name?: string
  name: string
  collateral_type: 'Brochures' | 'PowerPoint Presentations' | 'User Manuals' | 'Infographics'
  file_path: string
  file_type: string
  file_size: number
  human_file_size: string
  file_extension: string
  is_active: boolean
  created_at: string
  updated_at: string
  product?: {
    id: number
    name: string
    description?: string
    sku?: string
    unit_price: string
    is_active: boolean
  }
  creator?: {
    id: number
    name: string
    email: string
  }
}

export interface CollateralFilters {
  product_id?: string | number
  collateral_type?: string
  is_active?: boolean | string
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  per_page?: number
  page?: number
}

