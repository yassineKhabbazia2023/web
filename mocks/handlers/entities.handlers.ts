import { http, HttpResponse } from 'msw'
import {
  mockedAccount,
  mockedAccountId,
  mockedUserClientAccount,
  mockedUsersList,
  getMockedCollaborators,
  mockedCollaboratorsList2,
  getActiveOffersMocked,
  entitiesMock,
  subscriptionRequestMock,
  getMockedSubscriptionDetails,
  getMockedOperations,
  getMockedCollabRoles,
  delegationsHistoryMock,
  referentialHubsMock,
  referentialOfficesMock,
  accountReferentialInformationMock,
  getMockedAccountRow,
  getMockedAccount,
  getMockedSignatory,
  getMockedAuthorizationsConfig,
} from '@pulse/entities/mocks'

function getOperationsPaginatedResponse() {
  const operations = getMockedOperations()
  return {
    items: operations,
    currentPage: 1,
    totalPages: 1,
    totalItems: operations.length,
  }
}

function getAccountRowsMock() {
  return [
    getMockedAccountRow({
      accountId: 1,
      accountGlobalUniqueId: '5f85e793-57c0-4da6-b821-3b2888567256',
      accountNumber: 'V900000547',
      legalName: 'Acme Corp',
      isFavorite: false,
      signatory: getMockedSignatory({ contactId: 1 }),
    }),
    getMockedAccountRow({
      accountId: 2,
      accountGlobalUniqueId: '5f85e793-57c0-4da6-b821-3b2888567255',
      accountNumber: 'V900000546',
      legalName: 'Tech Solutions Ltd',
      isFavorite: true,
      signatory: getMockedSignatory({ contactId: 2 }),
      isCustomerRelation: true,
    }),
    getMockedAccountRow({
      accountId: 3,
      accountGlobalUniqueId: '5f85e793-57c0-4da6-b821-3b2888567254',
      accountNumber: 'V900000545',
      legalName: 'Global Services Inc',
      isFavorite: false,
      signatory: getMockedSignatory({ contactId: 3 }),
    }),
  ]
}

function getWalletPaginatedResponse() {
  const items = getAccountRowsMock()
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
    accountId: mockedAccountId,
    accountNumber: mockedAccount.accountNumber,
    turnover: 450000,
    officeId: 1,
    missionType: 'EC',
  }
}

export const entitiesHandlers = [
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

  http.get('*/account/api/delegations/currentuser/:accountId/history', () => {
    return HttpResponse.json(delegationsHistoryMock)
  }),

  http.delete('*/account/api/delegations/currentuser', () => {
    return HttpResponse.json({ success: true })
  }),

  http.post('*/wallet/api/delegations/currentuser', () => {
    return HttpResponse.json({ success: true })
  }),

  http.get('*/account/api/roles/signatory', () => {
    const signatory = getMockedSignatory()
    return HttpResponse.json([
      { contactId: signatory.contactId, firstName: signatory.firstName, lastName: signatory.lastName, email: signatory.email, isSignatory: true },
    ])
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

  http.patch('*/account/api/roles/customer-relation', () => {
    return HttpResponse.json({ success: true })
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

  http.get('*/wallet/api/statistics/currentuser', () => {
    return HttpResponse.json({
      toDeploy: 5,
      inProgress: 3,
      connected: 42,
      total: 50,
    })
  }),

  http.get('*/wallet/api/favorites/currentuser', () => {
    return HttpResponse.json(entitiesMock)
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
    return HttpResponse.json(subscriptionRequestMock)
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
    return HttpResponse.json({
      accountId: 602,
      contactId: 68,
      role: 'accountant',
    })
  }),

  http.post('*/pennylane/api/pennylane/role', () => {
    return HttpResponse.json({ success: true })
  }),
]
