export interface LoginStrategy {
  authenticate(email: string, password: string): Promise<void>
}

export interface SsoLoginStrategy {
  // Trigger the provider's redirect-based login flow.
  redirect(): Promise<void>
  // Complete login after the provider redirects back. Resolves to true when a
  // user was successfully authenticated, false when there was nothing to
  // complete (e.g. no token after the redirect).
  handleRedirectResult(): Promise<boolean>
}
