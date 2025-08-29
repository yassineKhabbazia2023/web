import { RouteName } from '../enums/route-name.enums'
import { RouteParam } from '../enums/route-param.enums'

export const APP_ROUTES = {
  root: { path: '/', name: RouteName.ROOT },
  maintenance: { path: '/maintenance', name: RouteName.MAINTENANCE },
  anonymous: { path: '', name: RouteName.ANONYMOUS },
  authenticated: { path: '', name: RouteName.AUTHENTICATED },
  login: {
    client: { path: 'login', name: RouteName.LOGIN_CLIENT },
    collab: { path: 'collaborateur', name: RouteName.LOGIN_COLLAB },
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
    root: { path: `/dossier/:${RouteParam.ENTITY_ID}`, name: RouteName.ENTITY },
    homepage: { path: '', name: RouteName.ENTITY_HOME },
    overview: {
      root: { path: '', name: RouteName.ENTITY_OVERVIEW },
      users: { path: 'gestion-utilisateurs', name: RouteName.USERS },
      collab: { path: 'collaborateurs', name: RouteName.COLLAB },
      offers: { path: 'offres', name: RouteName.OFFERS },
      info: { path: 'informations', name: RouteName.INFO },
      delegationsHistory: { path: 'historique-delegations', name: RouteName.DELEGATIONS_HISTORY },
    },
    powerbi: { path: 'rapports-bi', name: RouteName.REPORTS },
    ged: { path: 'ged', name: RouteName.GED },
    pennylaneAccounting: { path: 'comptabilite', name: RouteName.PENNYLANE_ACCOUNTING },
    launcher: { path: 'launcher', name: RouteName.LAUNCHER },
    bank: { path: 'banque', name: RouteName.BANK },
    indicators: { path: 'indicateurs', name: RouteName.INDICATORS },
  },
  wallet: {
    client: {
      root: { path: 'portefeuille', name: RouteName.WALLET_CLIENT },
      landing: { path: 'mes-entites', name: RouteName.ENTITY_CLIENT },
    },
    collab: {
      root: { path: 'portefeuille', name: RouteName.WALLET },
      landing: { path: 'dossiers', name: RouteName.FOLDERS },
      submitBIReport: { path: 'deposer-rapport-bi', name: RouteName.POWER_BI },
    },
  },
  error: {
    root: { path: '/error', name: RouteName.ERROR_ROOT },
    error403: { path: '403', name: RouteName.ERROR403 },
    error404: { path: '404', name: RouteName.ERROR404 },
    error500: { path: '500', name: RouteName.ERROR500 },
  },
}
