export interface GigyaAccounts {
  login: (params: { loginID: string, password: string }) => void
}

declare global {
  // eslint-disable-next-line no-var
  var gigya: {
    accounts: GigyaAccounts
  }
}
