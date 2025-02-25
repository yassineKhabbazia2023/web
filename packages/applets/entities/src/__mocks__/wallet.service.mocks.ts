import { mockedUserClientAccount } from './account.mocks'
import { getMockedCollabRoles } from './collab-roles.mocks'
import { getMockedCustomersCollab } from './contact.mocks'

const mockedCustomersCollab = getMockedCustomersCollab()

export const walletServiceMock = {
  fetchAccountContacts: vi.fn(() =>
    Promise.resolve({ items: [mockedUserClientAccount] }),
  ),
  fetchAccountCustomers: vi.fn(() => Promise.resolve({
    items: mockedCustomersCollab,
    totalItems: mockedCustomersCollab.length,
    currentPage: 1,
  })),
  fetchContactRoles: vi.fn(() => Promise.resolve(getMockedCollabRoles())),
  updateCollaborator: vi.fn(),
  fetchCustomers: vi.fn(),
}