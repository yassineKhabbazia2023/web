import { http, HttpResponse } from 'msw'
import {
  getLoginResponseMock,
  getCurrentUserResponseMock,
  getUserContextResponseMock,
} from '@pulse/common/mocks'
import { CollaboratorPermission } from '@pulse/common/enums'
import type { AppType } from '../types'

declare const __MSW_APP_TYPE__: AppType | undefined

function isCollaboratorApp(): boolean {
  return __MSW_APP_TYPE__ === 'collaborator'
}

function getCollaboratorPermissions() {
  return [
    CollaboratorPermission.CREER_JEUX_DONNEES,
    CollaboratorPermission.ACCEDER_ONGLET_UTILISATEURS,
    CollaboratorPermission.ACTIVER_OFFRE,
    CollaboratorPermission.ACCEDER_ONGLET_COLLABORATEURS,
    CollaboratorPermission.ACCEDER_ONGLET_INFORMATIONS,
    CollaboratorPermission.ACCEDER_GED_COMPTABLE,
    CollaboratorPermission.GED,
    CollaboratorPermission.ACCEDER_RAPPORTS_BI,
    CollaboratorPermission.ACCEDER_ONGLET_OFFRE,
    CollaboratorPermission.GESTION_DROITS_SUR_DOSSIER,
    CollaboratorPermission.GERER_DOSSIERS,
  ]
}

export const authHandlers = [
  // Login endpoint
  http.post('*/authentication/api/login', () => {
    return HttpResponse.json(getLoginResponseMock())
  }),

  // Token refresh endpoint - returns a new valid JWT string
  http.post('*/authentication/api/refreshToken', () => {
    return HttpResponse.json(getLoginResponseMock().webToken)
  }),

  // Logout endpoint
  http.post('*/authentication/api/logout', () => {
    return new HttpResponse(null, { status: 200 })
  }),

  // Current user (contact/me) - called by LoginManager.initAuthClient
  http.get('*/contact/me', () => {
    return HttpResponse.json(getCurrentUserResponseMock())
  }),

  // User context - called after navigation to landing page
  // Returns isCustomer and permissions based on the app type
  http.get('*/connect/api/get-user-information', () => {
    const userContext = getUserContextResponseMock()
    const isCollab = isCollaboratorApp()
    return HttpResponse.json({
      ...userContext,
      contact: {
        ...userContext.contact,
        isCustomer: isCollab === false,
      },
      ...(isCollab ? { permissions: getCollaboratorPermissions() } : {}),
    })
  }),
]
