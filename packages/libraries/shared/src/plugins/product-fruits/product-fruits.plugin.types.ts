export interface ProductFruitConfig {
  openChat?: () => void
}

export interface ProductFruitStatus {
  isActive: boolean
  isInitialized: boolean
}

export interface ProductFruitUser {
  username: string
  email: string
  firstname: string
  lastname: string
  role: string
  signUpAt: string
}

export interface InitProductFruitsParams {
  lang: string
  key: string
  user?: ProductFruitUser | null
  openChatCallback?: () => void
}

export interface InstallProductFruitsParams {
  isActive: boolean,
}
