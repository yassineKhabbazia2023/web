export interface TokenProviderStrategy {
  refreshToken(): Promise<string>
}
