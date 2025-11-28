import { RouteName, RouteParam } from '@pulse/common/enums'

export const COLLABORATOR_ROUTES = {
  root: { path: '/', name: RouteName.ROOT },
  maintenance: { path: '/maintenance', name: RouteName.MAINTENANCE },
  anonymous: { path: '', name: RouteName.ANONYMOUS },
  authenticated: { path: '', name: RouteName.AUTHENTICATED },
  landing: { path: 'landing', name: RouteName.LANDING },
  login: { path: '', name: RouteName.LOGIN_COLLAB },
  entity: {
    root: { path: `/dossier/:${RouteParam.ENTITY_ID}`, name: RouteName.ENTITY },
    homepage: { path: 'accueil', name: RouteName.HOMEPAGE },
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
    pennylaneAccounting: {
      root: { path: 'comptabilite', name: RouteName.PENNYLANE_ACCOUNTING },
      gedV2: { path: 'rydge', name: RouteName.PENNYLANE_GED_V2 },
      gedLegacy: { path: 'archive', name: RouteName.PENNYLANE_GED_LEGACY },
    },
    pennylaneSocialManagement: { path: 'gestion-sociale', name: RouteName.PENNYLANE_SOCIAL_MANAGEMENT },
    launcher: { path: 'launcher', name: RouteName.LAUNCHER },
  },
  wallet: {
    root: { path: 'portefeuille', name: RouteName.WALLET },
    landing: { path: 'dossiers', name: RouteName.FOLDERS },
    collaborators: { path: 'collaborateurs', name: RouteName.COLLABORATORS },
    accountManagement: { path: 'administration-dossiers', name: RouteName.ACCOUNT_MANAGEMENT },
    subscriptions: { path: 'demandes-mod', name: RouteName.SUBSCRIPTIONS },
    submitBIReport: { path: 'deposer-rapport-bi', name: RouteName.POWER_BI },
    biReportsList: { path: 'rapports-bi', name: RouteName.BI_REPORTS_LIST },
    offersCatalog: { path: 'catalogue-des-offres', name: RouteName.OFFERS_CATALOG },
    launcher: { path: 'launcher', name: RouteName.WALLET_LAUNCHER },
    mandates: { path: 'mandats', name: RouteName.MANDATES },
  },
  error: {
    root: { path: '/error', name: RouteName.ERROR_ROOT },
    error403: { path: '403', name: RouteName.ERROR403 },
    error404: { path: '404', name: RouteName.ERROR404 },
    error500: { path: '500', name: RouteName.ERROR500 },
  },
}
