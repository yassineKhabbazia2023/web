// Shim for powerbi-models

export const TokenType = {
  Embed: 1,
  Aad: 0,
}

// Empty interface to satisfy type imports
export interface IEmbedConfigurationBase {
  type?: string
  accessToken?: string
  embedUrl?: string
  id?: string
  uniqueId?: string
  settings?: unknown
  tokenType?: number
}

export default {
  TokenType,
}
