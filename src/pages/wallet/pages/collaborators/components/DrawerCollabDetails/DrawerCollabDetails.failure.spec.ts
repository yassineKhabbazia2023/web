import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import listContact from '../../mockCollaborators.json'
import listCollab from '../../mock.json'
import DrawerCollabDetails from '.'

let wrapper: VueWrapper<any>
const mockGatewayPatch = vi.fn(() => {
  return Promise.resolve({
    data: listContact.items[0],
  })
})
vi.mock('@/services/wallet', () => ({
  updateCollaborator: vi.fn(() => {
    throw new Error('Update failed')
  }),
}))
vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    gateway: {
      patch: mockGatewayPatch,
    },
  }),
  commonStore: () => ({
    $patch: vi.fn(),
  }),
}))
const { firstName, lastName } = listContact.items[0]
const rowData = {
  ...listCollab.data.items[0],
  fullName: `${firstName} ${lastName}`,
}

const createWrapper = (): VueWrapper<any> =>
  mount(DrawerCollabDetails, {
    props: {
      rowData,
      hasDrawerOpened: true,
    },
    attachTo: document.body,
  })

describe('drawerCollabDetails', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('displays an error notification on form submission failure', async () => {
    const buttonSubmit = wrapper.findAll('.el-drawer__footer button')[1]
    await buttonSubmit.trigger('click')
    await flushPromises()
    const getNotificationError = () => document.body.getElementsByClassName('el-notification error')
    expect(getNotificationError()).toHaveLength(1)
  })
})
