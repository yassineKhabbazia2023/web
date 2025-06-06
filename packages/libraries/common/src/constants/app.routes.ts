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
  wallet: {
    client: {
      root: { path: 'portefeuille', name: 'wallet-client' },
      landing: { path: 'mes-entites', name: 'entity-client' },
      folder: { path: `dossier/:${RouteParam.ENTITY_ID}`, name: RouteName.FOLDER },
    },
    collab: {
      root: { path: 'portefeuille', name: RouteName.WALLET },
      landing: { path: 'dossiers', name: RouteName.FOLDERS },
    },
  },
  error: {
    internalError: { path: '500', name: RouteName.INTERNAL_ERROR },
  },
}
