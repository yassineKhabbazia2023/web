export interface ProductFruitConfig {
  openChat?: () => void
}

export type ProductFruitsRole = 'Client' | 'Collaborateur'

export interface ProductFruitStatus {
  isActive: boolean
  isInitialized: boolean
}

export interface ProductFruitUser {
  id?: string
  email?: string
  firstName?: string
  lastName?: string
  isCollab?: boolean
}

export interface InitProductFruitsParams {
  lang: string
  key: string
  user?: ProductFruitUser | null
  openChat?: () => void
}

export interface InstallProductFruitsParams {
  isActive: boolean,
}
