export const APP_ROUTES = {
  root: { path: '/', name: 'root' },
  anonymous: { path: '', name: 'anonymous' },
  authenticated: { path: '', name: 'authenticated' },
  login: {
    client: { path: 'login', name: 'loginClient' },
    collab: { path: 'collaborateur', name: 'loginCollab' },
    cguValidation: { path: 'validation-cgu/:termsId', name: 'validationCGU' },
    expireToken: { path: 'expireToken', name: 'expireToken' },
    createPassword: { path: 'createPassword', name: 'createPassword' },
    resendEmailSuccess: { path: 'resendEmailSuccess', name: 'resendEmailSuccess' },
    resetPassword: { path: 'resetPassword', name: 'resetPassword' },
    resetPasswordSuccess: { path: 'resetPasswordSuccess', name: 'resetPasswordSuccess' },
    resetPasswordFailed: { path: 'resetPasswordFailed', name: 'resetPasswordFailed' },
    resetPasswordForm: { path: 'resetPasswordForm', name: 'resetPasswordForm' },
  },
  wallet: {
    client: {
      root: { path: 'portefeuille', name: 'wallet-client' },
      landing: { path: 'mes-entites', name: 'entity-client' },
      folder: { path: 'dossier/:id', name: 'folder' },
    },
    collab: {
      root: { path: 'portefeuille', name: 'wallet' },
      landing: { path: 'dossiers', name: 'folders' },
    },
  },
  error: {
    internalError: { path: '500', name: 'internalError' },
  },
}