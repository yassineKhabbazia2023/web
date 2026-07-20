import { http, HttpResponse } from 'msw'
import {
  mockedUserClientAccount,
  mockedUsersList,
  getMockedCollaborators,
  mockedCollaboratorsList2,
  getActiveOffersMocked,
  subscriptionRequestMock,
  getMockedSubscriptionDetails,
  getMockedOperations,
  getMockedCollabRoles,
  referentialHubsMock,
  referentialOfficesMock,
  accountReferentialInformationMock,
  getMockedAccount,
  getMockedAuthorizationsConfig,
} from '@pulse/entities/mocks'
import {
  getMockedEntitySummary,
  getMockedSubscription,
  getAllMockAccountRows,
  MockEntityId,
  MockEntityData,
  getMockSignatory,
} from '@pulse/common/mocks'
import { CustomerPermission, AccountType } from '@pulse/common/enums'

function getOperationsPaginatedResponse() {
  const operations = getMockedOperations()
  return {
    items: operations,
    currentPage: 1,
    totalPages: 1,
    totalItems: operations.length,
  }
}


function getWalletPaginatedResponse() {
  const items = getAllMockAccountRows()
  return {
    items,
    currentPage: 1,
    totalPages: 1,
    totalItems: items.length,
  }
}

function getCustomerContactsPaginatedResponse() {
  return {
    items: mockedUsersList,
    currentPage: 1,
    totalPages: 1,
    totalItems: mockedUsersList.length,
  }
}

function getSubscriptionsPaginatedResponse() {
  return {
    items: subscriptionRequestMock.map((sub, index) => ({
      ...sub,
      subscriptionId: index + 1,
    })),
    currentPage: 1,
    totalPages: 1,
    totalItems: subscriptionRequestMock.length,
  }
}

function getAccountData() {
  const account = getMockedAccount()
  return {
    ...account,
    accountId: MockEntityId.BASIC,
    accountNumber: MockEntityData.BASIC.accountNumber,
    turnover: 450000,
    officeId: 1,
    missionType: 'EC',
  }
}

// Pennylane subscription for Global Services Inc (Pennylane)
const pennylaneSubscription = getMockedSubscription({
  subscriptionId: 504,
  offerId: 8,
  status: 'validated',
  accountId: MockEntityId.PENNYLANE,
  offerCode: 'Pennylane',
  offerName: 'RYDGE Conseil x Pennylane',
})

// Entity summaries mapping for multi-entity customer story
const entitySummariesMap: Record<number, ReturnType<typeof getMockedEntitySummary>> = {
  [MockEntityId.BASIC]: getMockedEntitySummary({
    accountId: MockEntityId.BASIC,
    accountNumber: MockEntityData.BASIC.accountNumber,
    legalName: MockEntityData.BASIC.legalName,
    accountType: AccountType.REGULAR,
    subscriptions: [],
  }),
  [MockEntityId.LEGACY_GED]: getMockedEntitySummary({
    accountId: MockEntityId.LEGACY_GED,
    accountNumber: MockEntityData.LEGACY_GED.accountNumber,
    legalName: MockEntityData.LEGACY_GED.legalName,
    accountType: AccountType.REGULAR,
    subscriptions: [],
  }),
  [MockEntityId.PENNYLANE]: getMockedEntitySummary({
    accountId: MockEntityId.PENNYLANE,
    accountNumber: MockEntityData.PENNYLANE.accountNumber,
    legalName: MockEntityData.PENNYLANE.legalName,
    accountType: AccountType.REGULAR,
    subscriptions: [pennylaneSubscription],
  }),
  [MockEntityId.PROSPECT]: getMockedEntitySummary({
    accountId: MockEntityId.PROSPECT,
    accountNumber: MockEntityData.PROSPECT.accountNumber,
    legalName: MockEntityData.PROSPECT.legalName,
    accountType: AccountType.PROSPECT,
    subscriptions: [],
  }),
}

function getEntitySummaryById(entityId: number) {
  return entitySummariesMap[entityId] ?? getMockedEntitySummary({ accountId: entityId })
}

export const entitiesHandlers = [
  // Entity summary endpoint - used when navigating to an entity
  http.get('*/connect/api/accounts/:entityId/summary', ({ params }) => {
    const entityId = Number(params.entityId)
    return HttpResponse.json(getEntitySummaryById(entityId))
  }),

  http.get('*/account/api/accounts/:accountId/currentuser', () => {
    return HttpResponse.json(getAccountData())
  }),

  http.get('*/account/api/accounts/currentuser', () => {
    return HttpResponse.json(getWalletPaginatedResponse())
  }),

  http.get('*/account/api/accounts/all', () => {
    return HttpResponse.json(getWalletPaginatedResponse())
  }),

  http.get('*/account/api/accounts', ({ request }) => {
    const url = new URL(request.url)
    const searchParams = url.searchParams.toString()
    if (searchParams) {
      return HttpResponse.json(getWalletPaginatedResponse())
    }
    return HttpResponse.json(getAccountData())
  }),

  http.get('*/account/api/accounts/:accountId/contacts', () => {
    return HttpResponse.json({
      items: mockedUsersList,
      currentPage: 1,
      totalPages: 1,
      totalItems: mockedUsersList.length,
    })
  }),

  http.patch('*/account/api/accounts/:accountId/currentuser', () => {
    return HttpResponse.json({ success: true })
  }),

  http.delete('*/account/api/delegations/currentuser', () => {
    return HttpResponse.json({ success: true })
  }),

  http.post('*/wallet/api/delegations/currentuser', () => {
    return HttpResponse.json({ success: true })
  }),

  http.get('*/account/api/roles/signatory', () => {
    const signatory = getMockSignatory('BASIC')
    return HttpResponse.json([{
      contactId: signatory.contactId,
      firstName: signatory.firstName,
      lastName: signatory.lastName,
      email: signatory.email,
      isSignatory: true,
    }])
  }),

  http.get('*/account/api/roles/currentuser/hub/contact', () => {
    return HttpResponse.json({ items: getMockedCollaborators() })
  }),

  http.post('*/account/api/roles', () => {
    return HttpResponse.json({ success: true })
  }),

  http.patch('*/account/api/roles', () => {
    return HttpResponse.json({ success: true })
  }),

  http.delete('*/account/api/roles', () => {
    return HttpResponse.json({ success: true })
  }),

  http.get('*/account/api/roles/check', () => {
    return HttpResponse.json(false)
  }),

  http.patch('*/account/api/roles/customer-relation', async ({ request }) => {
    const { accountIds } = await request.json() as {
      accountIds: number[]
      isCustomerRelation: boolean
    }

    return HttpResponse.json({
      succeeded: accountIds.map(accountId => ({ accountId })),
      failed: [],
    })
  }),

  http.get('*/account/api/contacts', () => {
    return HttpResponse.json({
      items: [mockedUserClientAccount],
      currentPage: 1,
      totalPages: 1,
      totalItems: 1,
    })
  }),

  http.post('*/account/api/customers', () => {
    return HttpResponse.json({
      id: 999,
      ...mockedUserClientAccount,
    })
  }),

  http.get('*/wallet/api/infos/currentuser', () => {
    const accountRows = getAllMockAccountRows()
    return HttpResponse.json({
      prospectEntitiesCount: 1,
      regularEntitiesCount: accountRows.length - 1,
    })
  }),

  http.get('*/wallet/api/statistics/currentuser', () => {
    return HttpResponse.json({
      toDeploy: 5,
      inProgress: 3,
      connected: 42,
      total: 50,
    })
  }),

  http.get('*/wallet/api/favorites/currentuser', () => {
    // Return favorites that match wallet entities
    const accountRows = getAllMockAccountRows()
    const favorites = accountRows.map(row => ({
      accountId: row.accountId,
      accountNumber: row.accountNumber,
      legalName: row.legalName,
    }))
    return HttpResponse.json(favorites)
  }),

  http.patch('*/wallet/api/favorites/currentuser', () => {
    return HttpResponse.json({ success: true })
  }),

  http.get('*/wallet/api/contacts', () => {
    return HttpResponse.json(mockedCollaboratorsList2)
  }),

  http.patch('*/wallet/api/contacts/:contactId', () => {
    return HttpResponse.json({ success: true })
  }),

  http.get('*/wallet/api/personas/:contactType', () => {
    const collabRoles = getMockedCollabRoles()
    return HttpResponse.json(collabRoles.slice(0, 3))
  }),

  http.get('*/customer-wallet/api/accounts/:accountId/contacts', () => {
    const items = mockedCollaboratorsList2.items.map((item: any) => ({
      ...item,
      personaName: item.persona?.name ?? '',
      contactId: item.id,
    }))
    return HttpResponse.json({
      items,
      currentPage: mockedCollaboratorsList2.currentPage,
      totalPage: mockedCollaboratorsList2.totalPages,
      totalItems: mockedCollaboratorsList2.totalItems,
    })
  }),

  http.get('*/customer-wallet/api/customers/currentuser', () => {
    return HttpResponse.json(getCustomerContactsPaginatedResponse())
  }),

  http.get('*/customer-wallet/api/contacts/:contactId', () => {
    return HttpResponse.json(getMockedCollaborators()[0])
  }),

  http.patch('*/customer-wallet/api/contacts/:contactId', () => {
    return HttpResponse.json({ success: true })
  }),

  http.get('*/contact/api/contacts', () => {
    return HttpResponse.json({ items: getMockedCollaborators() })
  }),

  http.post('*/contact/api/customers/bulk-invite/:accountNumber', () => {
    return HttpResponse.json([1, 2, 3])
  }),

  http.get('*/offer/api/offers', () => {
    return HttpResponse.json(getActiveOffersMocked())
  }),

  http.get('*/offer/api/offers/:offerId', () => {
    return HttpResponse.json(getActiveOffersMocked()[0])
  }),

  http.get('*/offer/api/contacts', () => {
    return HttpResponse.json({ items: getMockedCollaborators() })
  }),

  http.get('*/offer/api/referentials/hubs', () => {
    return HttpResponse.json(referentialHubsMock)
  }),

  http.get('*/offer/api/referentials/offices', () => {
    return HttpResponse.json(referentialOfficesMock)
  }),

  http.get('*/offer/api/referentials/AccountReferentialInformation', () => {
    return HttpResponse.json(accountReferentialInformationMock)
  }),

  http.get('*/offer/api/subscription', () => {
    return HttpResponse.json({
      items: subscriptionRequestMock,
      currentPage: 1,
      totalPages: 1,
      totalItems: subscriptionRequestMock.length,
    })
  }),

  http.get('*/offer/api/subscription/stats', () => {
    return HttpResponse.json({
      statuses: {
        pending: 1,
        validated: 1,
        'pennylane-to-transfer': 1,
        'pennylane-transfer-in-progress': 1,
      },
    })
  }),

  http.put('*/offer/api/subscription/:subscriptionId/confirm-transfer', () => {
    return HttpResponse.json({ success: true })
  }),

  http.get('*/offer/api/subscriptions', () => {
    return HttpResponse.json(getSubscriptionsPaginatedResponse())
  }),

  http.get('*/offer/api/subscriptions/:subscriptionId/details', () => {
    return HttpResponse.json(getMockedSubscriptionDetails())
  }),

  http.post('*/offer/api/subscriptions', () => {
    return HttpResponse.json({ success: true, subscriptionId: 999 })
  }),

  http.get('*/registry/api/operations', () => {
    return HttpResponse.json(getMockedOperations())
  }),

  http.get('*/registry/api/currentuser/operations', () => {
    return HttpResponse.json(getOperationsPaginatedResponse())
  }),

  http.patch('*/registry/api/operations/:operationId/currentuser', () => {
    return HttpResponse.json({ success: true })
  }),

  http.post('*/entitycreator/api/Onboarding', () => {
    return HttpResponse.json({ success: true, accountId: 999 })
  }),

  http.get('*/entitycreator/api/AccountInjector/generate-account-number', () => {
    return HttpResponse.json({ accountNumber: 'V999999999' })
  }),

  // Permissions endpoint - returns different permissions per entity
  http.get('*/authorization/api/authorization/currentuser', ({ request }) => {
    const url = new URL(request.url)
    const accountId = Number(url.searchParams.get('accountId'))

    // Acme Corp (basic) - New client with minimal permissions
    const basicPermissions = [
      CustomerPermission.CONSULTER_UTILISATEURS,
      CustomerPermission.ACCEDER_INFORMATIONS_ENTREPRISE,
      CustomerPermission.ACCEDER_OFFRES_SOUSCRITES,
    ]

    // Tech Solutions Ltd (legacy) - Legacy GED + PowerBI + Launcher
    const legacyGedPermissions = [
      CustomerPermission.ACCEDER_GED_COMPTABLE,
      CustomerPermission.ACCEDER_GED_GESTION_SOCIALE,
      CustomerPermission.ACCEDER_RAPPORTS_BI_FINANCIER,
      CustomerPermission.ACCEDER_RAPPORTS_BI_RH,
      CustomerPermission.ACCEDER_OUTIL_MEG,
      CustomerPermission.CONSULTER_UTILISATEURS,
      CustomerPermission.ACCEDER_INFORMATIONS_ENTREPRISE,
      CustomerPermission.ACCEDER_OFFRES_SOUSCRITES,
    ]

    // Global Services Inc (Pennylane) - Pennylane accounting + social management + PowerBI + Launcher
    const pennylanePermissions = [
      CustomerPermission.ACCEDER_OUTIL_PENNYLANE,
      CustomerPermission.ACCEDER_DOCUMENTS_PENNYLANE,
      CustomerPermission.ACCEDER_GED_GESTION_SOCIALE,
      CustomerPermission.ACCEDER_RAPPORTS_BI_FINANCIER,
      CustomerPermission.ACCEDER_RAPPORTS_BI_RH,
      CustomerPermission.ACCEDER_OUTIL_MEG,
      CustomerPermission.CONSULTER_UTILISATEURS,
      CustomerPermission.ACCEDER_INFORMATIONS_ENTREPRISE,
      CustomerPermission.ACCEDER_OFFRES_SOUSCRITES,
    ]

    // Le Beau Prospect - all conformity steps granted except the payment method,
    // to showcase the access-denied step message
    const prospectPermissions = [
      CustomerPermission.ACCEDER_CONFORMITE_BENEFICIAIRES_EFFECTIFS,
      CustomerPermission.ACCEDER_CONFORMITE_DOCUMENTS_JUSTIFICATIFS,
      CustomerPermission.ACCEDER_CONFORMITE_PROPOSITION_COMMERCIALE,
      CustomerPermission.ACCEDER_CONFORMITE_LETTRE_MISSION,
      CustomerPermission.ACCEDER_DOSSIER_DOCUMENTS_PROSPECT,
      CustomerPermission.CONSULTER_UTILISATEURS,
      CustomerPermission.AJOUTER_UTILISATEUR,
      CustomerPermission.SUPPRIMER_UTILISATEUR,
      CustomerPermission.GERER_DROITS_UTILISATEURS,
      CustomerPermission.ACCEDER_INFORMATIONS_ENTREPRISE,
    ]

    const permissionsMap: Record<number, string[]> = {
      [MockEntityId.BASIC]: basicPermissions,
      [MockEntityId.LEGACY_GED]: legacyGedPermissions,
      [MockEntityId.PENNYLANE]: pennylanePermissions,
      [MockEntityId.PROSPECT]: prospectPermissions,
    }

    const permissions = permissionsMap[accountId] ?? basicPermissions

    return HttpResponse.json(permissions)
  }),

  http.get('*/authorization/api/authorizations/configuration', () => {
    return HttpResponse.json(getMockedAuthorizationsConfig())
  }),

  http.post('*/authorization/api/authorizations/configuration', () => {
    return HttpResponse.json({ success: true })
  }),

  http.get('*/authorization/api/authorizations/configuration/account', () => {
    return HttpResponse.json(getMockedAuthorizationsConfig().slice(0, 1))
  }),

  http.get('*/pennylane/api/pennylane/role/accounts/:accountId/contacts/:contactId', () => {
    const basicSignatory = getMockSignatory('BASIC')
    return HttpResponse.json({
      accountId: MockEntityId.PENNYLANE,
      contactId: basicSignatory.contactId,
      role: 'accountant',
    })
  }),

  http.post('*/pennylane/api/pennylane/role', () => {
    return HttpResponse.json({ success: true })
  }),
]
