import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { EntityContactService } from '@pulse/common/services/contact'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import type { EntityContact } from '@pulse/common/services/contact'
import { useProspectContacts } from './use-prospect-contacts.composable'

vi.mock('@pulse/common/services/contact')

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

const contactFixture: EntityContact = {
  firstname: 'Anna',
  lastname: 'Smith',
  role: 'ESC',
  phoneNumber: '0611111111',
  email: 'anna@example.com',
}

describe('useProspectContacts', () => {
  beforeEach(() => {
    currentEntityStoreMock.currentEntityId = 42
    vi.mocked(EntityContactService.getProspectContacts).mockResolvedValue([contactFixture])
  })

  it('should expose empty contacts and not loading by default', () => {
    currentEntityStoreMock.currentEntityId = undefined

    const [result, app] = withSetup(() => useProspectContacts())

    expect(result.contacts.value).toStrictEqual([])
    expect(result.isContactsLoading.value).toBe(false)

    app.unmount()
  })

  it('should fetch contacts on mount with the current account id', async () => {
    const [result, app] = withSetup(() => useProspectContacts())
    await flushPromises()

    expect(vi.mocked(EntityContactService.getProspectContacts)).toHaveBeenCalledExactlyOnceWith(42)
    expect(result.contacts.value).toStrictEqual([contactFixture])
    expect(result.isContactsLoading.value).toBe(false)

    app.unmount()
  })

  it('should skip the fetch when there is no current account id', async () => {
    currentEntityStoreMock.currentEntityId = undefined

    const [result, app] = withSetup(() => useProspectContacts())
    await flushPromises()

    expect(vi.mocked(EntityContactService.getProspectContacts)).not.toHaveBeenCalled()
    expect(result.contacts.value).toStrictEqual([])
    expect(result.isContactsLoading.value).toBe(false)

    app.unmount()
  })

  it('should re-fetch when the current account id changes', async () => {
    const otherContact: EntityContact = { ...contactFixture, email: 'bob@example.com' }
    vi.mocked(EntityContactService.getProspectContacts)
      .mockResolvedValueOnce([contactFixture])
      .mockResolvedValueOnce([otherContact])

    const [result, app] = withSetup(() => useProspectContacts())
    await flushPromises()

    currentEntityStoreMock.currentEntityId = 99
    await flushPromises()

    expect(vi.mocked(EntityContactService.getProspectContacts)).toHaveBeenNthCalledWith(1, 42)
    expect(vi.mocked(EntityContactService.getProspectContacts)).toHaveBeenNthCalledWith(2, 99)
    expect(result.contacts.value).toStrictEqual([otherContact])

    app.unmount()
  })

  it('should reset contacts when the current account id becomes undefined', async () => {
    const [result, app] = withSetup(() => useProspectContacts())
    await flushPromises()

    currentEntityStoreMock.currentEntityId = undefined
    await flushPromises()

    expect(result.contacts.value).toStrictEqual([])

    app.unmount()
  })
})
