export interface LogoutStrategy {
  cleanup(): Promise<void>
}
