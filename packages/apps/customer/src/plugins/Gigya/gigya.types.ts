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
