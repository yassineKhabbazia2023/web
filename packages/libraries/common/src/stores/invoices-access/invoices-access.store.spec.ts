import { ref } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import { getInvoicesAccessResponseMock, getMockedUser, getMockedEntitySummary } from '../../__mocks__'
import { InvoicesTabState } from '../../services/invoices-access/invoices-access.service.types'
import { useUserStore } from '../user/user.store'
import { useCurrentEntityStore } from '../current-entity/current-entity.store'
import { useInvoicesAccessStore } from './invoices-access.store'

const isMobileRef = ref(false)

vi.mock('@pulse/styleguide', () => ({
  useResponsive: () => ({ isMobile: isMobileRef }),
}))


const USER_EMAIL = 'contact@example.com'

function setUpCollabUser() {
  const userStore = useUserStore()
  userStore.setUser(getMockedUser({ isCollab: true, email: USER_EMAIL }))
}

function setUpCustomerUser(email = USER_EMAIL) {
  const userStore = useUserStore()
  userStore.setUser(getMockedUser({ isCollab: false, email }))
}

function setUpSignatoryEntity() {
  const currentEntityStore = useCurrentEntityStore()
  currentEntityStore.setCurrentEntity(getMockedEntitySummary({ isSignatory: true }))
}

function setUpNonSignatoryEntity() {
  const currentEntityStore = useCurrentEntityStore()
  currentEntityStore.setCurrentEntity(getMockedEntitySummary({ isSignatory: false }))
}

describe('useInvoicesAccessStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    isMobileRef.value = false
  })

  describe('initial state', () => {
    it('should have default values', () => {
      const store = useInvoicesAccessStore()

      expect(store.isTabVisible).toBe(false)
      expect(store.tabState).toBeNull()
      expect(store.contactWithAccess).toBeNull()
      expect(store.externalDematMail).toBeNull()
    })
  })

  describe('setAccessData', () => {
    it('should set all state from response', () => {
      const store = useInvoicesAccessStore()
      setUpCustomerUser()
      setUpNonSignatoryEntity()
      const response = getInvoicesAccessResponseMock({
        contactWithAccess: USER_EMAIL,
        tabState: InvoicesTabState.CONNECTION_READY_LOCKED,
      })

      store.setAccessData(response)

      expect(store.isTabVisible).toBe(true)
      expect(store.tabState).toBe(response.tabState)
      expect(store.contactWithAccess).toBe(response.contactWithAccess)
      expect(store.externalDematMail).toBe(response.externalDematMail)
    })

    it('should reset state when response is null', () => {
      const store = useInvoicesAccessStore()
      setUpCustomerUser()
      setUpNonSignatoryEntity()
      const response = getInvoicesAccessResponseMock({
        contactWithAccess: USER_EMAIL,
        tabState: InvoicesTabState.CONNECTION_READY_LOCKED,
      })

      store.setAccessData(response)
      expect(store.isTabVisible).toBe(true)

      store.setAccessData(null)

      expect(store.isTabVisible).toBe(false)
      expect(store.tabState).toBeNull()
      expect(store.contactWithAccess).toBeNull()
      expect(store.externalDematMail).toBeNull()
    })

    it('should set isTabVisible to true when user is collab even if contactWithAccess does not match and tabState is not connection ready', () => {
      const store = useInvoicesAccessStore()
      setUpCollabUser()
      setUpNonSignatoryEntity()
      const response = getInvoicesAccessResponseMock({
        contactWithAccess: null,
        externalDematMail: null,
        tabState: InvoicesTabState.FORM_START,
      })

      store.setAccessData(response)

      expect(store.isTabVisible).toBe(true)
    })

    it('should set isTabVisible to true when user is signatory even if contactWithAccess does not match and tabState is not connection ready', () => {
      const store = useInvoicesAccessStore()
      setUpCustomerUser()
      setUpSignatoryEntity()
      const response = getInvoicesAccessResponseMock({
        contactWithAccess: null,
        externalDematMail: null,
        tabState: InvoicesTabState.FORM_START,
      })

      store.setAccessData(response)

      expect(store.isTabVisible).toBe(true)
    })

    it('should set isTabVisible to true when non-signatory client and contactWithAccess matches userEmail and tabState is CONNECTION_READY_LOCKED', () => {
      const store = useInvoicesAccessStore()
      setUpCustomerUser()
      setUpNonSignatoryEntity()
      const response = getInvoicesAccessResponseMock({
        contactWithAccess: USER_EMAIL,
        externalDematMail: null,
        tabState: InvoicesTabState.CONNECTION_READY_LOCKED,
      })

      store.setAccessData(response)

      expect(store.isTabVisible).toBe(true)
    })

    it('should set isTabVisible to true when non-signatory client and contactWithAccess matches userEmail and tabState is CONNECTION_READY_UNLOCKED', () => {
      const store = useInvoicesAccessStore()
      setUpCustomerUser()
      setUpNonSignatoryEntity()
      const response = getInvoicesAccessResponseMock({
        contactWithAccess: USER_EMAIL,
        externalDematMail: null,
        tabState: InvoicesTabState.CONNECTION_READY_UNLOCKED,
      })

      store.setAccessData(response)

      expect(store.isTabVisible).toBe(true)
    })

    it('should set isTabVisible to false when non-signatory client and contactWithAccess matches userEmail but tabState is FORM_START', () => {
      const store = useInvoicesAccessStore()
      setUpCustomerUser()
      setUpNonSignatoryEntity()
      const response = getInvoicesAccessResponseMock({
        contactWithAccess: USER_EMAIL,
        externalDematMail: null,
        tabState: InvoicesTabState.FORM_START,
      })

      store.setAccessData(response)

      expect(store.isTabVisible).toBe(false)
    })

    it('should set isTabVisible to false when non-signatory client and contactWithAccess matches userEmail but tabState is FORM_SUBMITTED', () => {
      const store = useInvoicesAccessStore()
      setUpCustomerUser()
      setUpNonSignatoryEntity()
      const response = getInvoicesAccessResponseMock({
        contactWithAccess: USER_EMAIL,
        externalDematMail: null,
        tabState: InvoicesTabState.FORM_SUBMITTED,
      })

      store.setAccessData(response)

      expect(store.isTabVisible).toBe(false)
    })

    it('should set isTabVisible to false when non-signatory client and contactWithAccess does not match userEmail', () => {
      const store = useInvoicesAccessStore()
      setUpCustomerUser()
      setUpNonSignatoryEntity()
      const response = getInvoicesAccessResponseMock({ contactWithAccess: 'other@example.com', externalDematMail: null })

      store.setAccessData(response)

      expect(store.isTabVisible).toBe(false)
    })

    it('should set isTabVisible to false when non-signatory client and contactWithAccess is null', () => {
      const store = useInvoicesAccessStore()
      setUpCustomerUser()
      setUpNonSignatoryEntity()
      const response = getInvoicesAccessResponseMock({ contactWithAccess: null, externalDematMail: null })

      store.setAccessData(response)

      expect(store.isTabVisible).toBe(false)
    })

    it('should set isTabVisible to false when non-signatory client and externalDematMail is set but contactWithAccess does not match', () => {
      const store = useInvoicesAccessStore()
      setUpCustomerUser()
      setUpNonSignatoryEntity()
      const response = getInvoicesAccessResponseMock({ contactWithAccess: null, externalDematMail: 'dmat@example.com' })

      store.setAccessData(response)

      expect(store.isTabVisible).toBe(false)
    })
  })

  describe('reactivity', () => {
    it('should reactively update isTabVisible when user data arrives after setAccessData', () => {
      const store = useInvoicesAccessStore()
      const response = getInvoicesAccessResponseMock({
        contactWithAccess: null,
        tabState: InvoicesTabState.FORM_START,
      })

      // Access data is set before user data is available (simulating F5 refresh)
      store.setAccessData(response)
      expect(store.isTabVisible).toBe(false)

      // User data arrives later (simulating initCurrentUser completing)
      setUpCollabUser()
      expect(store.isTabVisible).toBe(true)
    })
  })

  describe('mobile visibility', () => {
    it('should set isTabVisible to false when isMobile is true even for collab user', () => {
      isMobileRef.value = true
      const store = useInvoicesAccessStore()
      setUpCollabUser()
      setUpNonSignatoryEntity()
      const response = getInvoicesAccessResponseMock({
        contactWithAccess: null,
        tabState: InvoicesTabState.FORM_START,
      })

      store.setAccessData(response)

      expect(store.isTabVisible).toBe(false)
    })

    it('should set isTabVisible to false when isMobile is true even for signatory user', () => {
      isMobileRef.value = true
      const store = useInvoicesAccessStore()
      setUpCustomerUser()
      setUpSignatoryEntity()
      const response = getInvoicesAccessResponseMock({
        contactWithAccess: null,
        tabState: InvoicesTabState.FORM_START,
      })

      store.setAccessData(response)

      expect(store.isTabVisible).toBe(false)
    })

    it('should set isTabVisible to false when isMobile is true even for client with access', () => {
      isMobileRef.value = true
      const store = useInvoicesAccessStore()
      setUpCustomerUser()
      setUpNonSignatoryEntity()
      const response = getInvoicesAccessResponseMock({
        contactWithAccess: USER_EMAIL,
        tabState: InvoicesTabState.CONNECTION_READY_LOCKED,
      })

      store.setAccessData(response)

      expect(store.isTabVisible).toBe(false)
    })
  })

  describe('reset', () => {
    it('should reset all values to their defaults', () => {
      const store = useInvoicesAccessStore()
      setUpCollabUser()
      const response = getInvoicesAccessResponseMock({
        contactWithAccess: USER_EMAIL,
        tabState: InvoicesTabState.CONNECTION_READY_LOCKED,
      })

      store.setAccessData(response)

      expect(store.isTabVisible).toBe(true)
      expect(store.tabState).toBe(response.tabState)

      store.reset()

      expect(store.isTabVisible).toBe(false)
      expect(store.tabState).toBeNull()
      expect(store.contactWithAccess).toBeNull()
      expect(store.externalDematMail).toBeNull()
    })
  })
})
