import { RouteName, RouteParam } from '@pulse/common/enums'

export const CUSTOMER_ROUTES = {
  root: { path: '/', name: RouteName.ROOT },
  maintenance: { path: '/maintenance', name: RouteName.MAINTENANCE },
  anonymous: { path: '', name: RouteName.ANONYMOUS },
  authenticated: { path: '', name: RouteName.AUTHENTICATED },
  landing: { path: 'landing', name: RouteName.LANDING },
  redirectAction: { path: 'redirect', name: RouteName.REDIRECT_ACTION },
  pennylaneSsoProxy: { path: 'pennylane-sso-proxy', name: RouteName.PENNYLANE_SSO_PROXY },
  login: {
    client: { path: 'login', name: RouteName.LOGIN_CLIENT },
    cguValidation: { path: 'validation-cgu/:termsId', name: RouteName.VALIDATION_CGU },
    expireToken: { path: 'expireToken', name: RouteName.EXPIRE_TOKEN },
    createPassword: { path: 'createPassword', name: RouteName.CREATE_PASSWORD },
    resendEmailSuccess: { path: 'resendEmailSuccess', name: RouteName.RESEND_EMAIL_SUCCESS },
    resetPassword: { path: 'resetPassword', name: RouteName.RESET_PASSWORD },
    resetPasswordSuccess: { path: 'resetPasswordSuccess', name: RouteName.RESET_PASSWORD_SUCCESS },
    resetPasswordFailed: { path: 'resetPasswordFailed', name: RouteName.RESET_PASSWORD_FAILED },
    resetPasswordForm: { path: 'resetPasswordForm', name: RouteName.RESET_PASSWORD_FORM },
  },
  entity: {
    redirect: { path: `entity/:${RouteParam.ENTITY_ID}`, name: RouteName.ENTITY_REDIRECT },
    regular: {
      root: { path: `/dossier/:${RouteParam.ENTITY_ID}`, name: RouteName.ENTITY },
      homepage: { path: 'accueil', name: RouteName.HOMEPAGE },
      overview: {
        root: { path: '', name: RouteName.ENTITY_OVERVIEW },
        users: { path: 'gestion-utilisateurs', name: RouteName.USERS },
        offers: { path: 'offres', name: RouteName.OFFERS },
        invoices: { path: 'factures-rydge-conseil', name: RouteName.RYDGE_INVOICES },
        info: { path: 'informations', name: RouteName.INFO },
      },
      powerbi: { path: 'rapports-bi', name: RouteName.REPORTS },
      ged: { path: 'ged', name: RouteName.GED },
      pennylaneAccounting: {
        root: { path: 'comptabilite', name: RouteName.PENNYLANE_ACCOUNTING },
        gedV2: { path: 'rydge', name: RouteName.PENNYLANE_GED_V2 },
        gedLegacy: { path: 'archive', name: RouteName.PENNYLANE_GED_LEGACY },
      },
      pennylaneSocialManagement: { path: 'gestion-sociale', name: RouteName.PENNYLANE_SOCIAL_MANAGEMENT },
      launcher: { path: 'launcher', name: RouteName.LAUNCHER },
    },
    prospect: {
      root: { path: `/contact/:${RouteParam.ENTITY_ID}`, name: RouteName.PROSPECT },
      homepage: { path: 'accueil', name: RouteName.PROSPECT_HOMEPAGE },
      conformity: { path: 'suivi-de-dossier', name: RouteName.PROSPECT_CONFORMITY },
      overview: {
        root: { path: '', name: RouteName.PROSPECT_OVERVIEW },
        users: { path: 'gestion-utilisateurs', name: RouteName.PROSPECT_USERS },
      },
    },
  },
  wallet: {
    root: { path: 'portefeuille', name: RouteName.WALLET },
    landingCustomer: { path: 'mes-entites', name: RouteName.CUSTOMER_ENTITIES },
    prospects: { path: 'dossiers-en-cours', name: RouteName.CUSTOMER_PROSPECTS },
  },
  profile: {
    information: { path: 'profil/informations', name: RouteName.PROFILE_INFORMATION },
    password: { path: 'profil/mot-de-passe', name: RouteName.PROFILE_PASSWORD },
  },
  error: {
    root: { path: '/error', name: RouteName.ERROR_ROOT },
    error403: { path: '403', name: RouteName.ERROR403 },
    error404: { path: '404', name: RouteName.ERROR404 },
    error500: { path: '500', name: RouteName.ERROR500 },
  },
}
