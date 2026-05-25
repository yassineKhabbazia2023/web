export interface LoginStrategy {
  authenticate(email: string, password: string): Promise<void>
}
