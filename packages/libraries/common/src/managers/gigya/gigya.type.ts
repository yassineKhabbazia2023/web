export interface GigyaAccounts {
  login: (params: { loginID: string, password: string }) => void
  logout: () => void
}

declare global {

  var gigya: {
    accounts: GigyaAccounts
  }
}
