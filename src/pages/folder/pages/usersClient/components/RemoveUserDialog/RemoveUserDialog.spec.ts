import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { deleteContactFromAccount } from '@/services/account'
import RemoveUserDialog from './'

const ACCOUNT_ID = '42'
const USER_TO_REMOVE = {
  initials: 'ab',
  fullName: 'a b',
  email: 'customEmail@labas.be',
  contactId: 'customContactId',
}

vi.mock('@/services/account', () => ({
  deleteContactFromAccount: vi.fn(() => Promise.resolve()),
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      id: ACCOUNT_ID,
    },
  }),
}))

let wrapper: VueWrapper<any>
const createWrapper = (): VueWrapper<any> =>
  mount(RemoveUserDialog, {
    props: {
      userToRemove: USER_TO_REMOVE,
      modelValue: true,
    },
  })

describe('removeUserDialog', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('displays the user information that will be removed', () => {
    const {
      initials,
      fullName,
      email,
    } = USER_TO_REMOVE

    const pUserCardComponent = wrapper.findComponent({ name: 'PUserCard' })

    expect(pUserCardComponent.props()).toStrictEqual(
      expect.objectContaining({
        pAssetContent: initials,
        pTitle: fullName,
        pSubtitle: email,
      }),
    )
  })

  it('removes a user and display a success notification', async () => {
    const getNotificationSuccess = () => document.body.getElementsByClassName('el-notification success')
    expect(getNotificationSuccess()).toHaveLength(0)

    const removeUserButton = wrapper.find('[data-testid=removeUserButton]')
    await removeUserButton.trigger('click')

    expect(vi.mocked(deleteContactFromAccount)).toHaveBeenCalledOnce()
    expect(vi.mocked(deleteContactFromAccount)).toHaveBeenCalledWith(
      Number(ACCOUNT_ID),
      USER_TO_REMOVE.contactId,
    )
    expect(getNotificationSuccess()).toHaveLength(1)
    expect(wrapper.emitted('userRemoved')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
  })
})
