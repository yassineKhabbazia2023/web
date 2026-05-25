export type GigyaSamlContinueSSOFn = (
  params: Record<string, unknown>,
  shouldRedirectToProxy: boolean,
) => void

export interface GigyaSaml {
  continueSSO: GigyaSamlContinueSSOFn
}

export interface GigyaFidm {
  saml?: GigyaSaml
}

export interface GigyaSamlSDK {
  fidm?: GigyaFidm
}

export interface GigyaAccounts {
  login: (params: { loginID: string, password: string }) => void
  logout: () => void
}

declare global {

  var gigya: {
    accounts: GigyaAccounts
  }
}
