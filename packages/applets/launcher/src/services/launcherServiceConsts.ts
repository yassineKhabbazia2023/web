// cette variable permet d'extraire le nom du fichier fourni par
// l'api dans le Header de la réponse lorsque l'on télécharge l'application Silae
export const EXTRACT_DOWNLOADED_FILENAME_REGEXP = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/

export const DEFAULT_APPLICATION_FILENAME = 'myPulse.DesktopClient-x.exe'

export const ApiRoutes = {
  SILAE_SSO: 'social/desktop-client/currentuser/generate-sso-link',
  SILAE_SSO_FILE: 'social/desktop-client/versions/latest',
}
