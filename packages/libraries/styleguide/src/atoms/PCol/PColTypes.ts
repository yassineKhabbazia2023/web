type breakpointConfig = {
  span?: number
  offset?: number
  pull?: number
  push?: number
}

export interface PColProps {
  pSpan?: number
  pOffset?: number
  pPush?: number
  pPull?: number
  pXs?: number | breakpointConfig
  pSm?: number | breakpointConfig
  pMd?: number | breakpointConfig
  pLg?: number | breakpointConfig
  pXl?: number | breakpointConfig
  pTag?: string
}
