import { shallowMount, type VueWrapper } from '@vue/test-utils'
import delegationsHistoryMock from '@entities/__mocks__/json/delegationsHistory.json'
import { deleteAccountDelegation, fetchAccountDelegationsHistory } from '@entities/services/account/accountServices'
import { useUserStore } from '@pulse/common/stores'
import { getMockedUser, getStoreMock } from '@pulse/common/mocks'

import DelegationsHistory from './'

const CURRENT_ACCOUNT_ID = '602'
const userMock = getMockedUser({ id: 7 })

const userStoreMock = getStoreMock(useUserStore)

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      id: CURRENT_ACCOUNT_ID,
    },
  }),
}))

vi.mock('@entities/services/account/accountServices', () => ({
  deleteAccountDelegation: vi.fn(),
  fetchAccountDelegationsHistory: vi.fn(() => Promise.resolve(delegationsHistoryMock)),
}))

const createWrapper = (): VueWrapper<any> =>
  shallowMount(DelegationsHistory, {
    global: {
      stubs: {
        PLoader: true,
        PScrollbar: { template: '<div><slot /></div>' },
        PTimeline: { template: '<div><slot /></div>' },
        PTimelineItem: {
          name: 'PTimelineItem',
          template: '<div><slot /></div>',
        },
        PHistoryCard: {
          name: 'PHistoryCard',
          template: '<div><slot name="text" /><slot name="action" /></div>',
          props: [
            'pDate',
            'pEntity',
          ],
        },
        FormSearch: {
          name: 'FormSearch',
          template: '<div><slot /></div>',
          emits: ['search-value-submitted'],
        },
        'i18n-t': { template: '<div><slot name="delegator" /> delegated the folder<slot name="delegatee" />.</div>' },
        PTooltip: { template: '<div><slot /></div>' },
        NoResult: true,
        PButton: true,
      },
    },
    attachTo: document.body,
  })

describe('delegationsHistory', () => {
  let wrapper: VueWrapper<any>

  const getTimeLineItems = () => wrapper.findAllComponents({ name: 'PTimelineItem' })
  const getPHistoryCard = (index: number) => getTimeLineItems()[index].findComponent({ name: 'PHistoryCard' })

  beforeEach(() => {
    userStoreMock.user = userMock
    wrapper = createWrapper()
  })

  it('display delegations', () => {
    expect(fetchAccountDelegationsHistory).toHaveBeenCalledOnce()
    expect(fetchAccountDelegationsHistory).toHaveBeenCalledWith(
      Number(CURRENT_ACCOUNT_ID),
      new URLSearchParams({}),
    )

    expect(getTimeLineItems()).toHaveLength(delegationsHistoryMock.items.length)
    expect(getPHistoryCard(0).props('pDate')).toBe('4/25/2024')
    expect(getPHistoryCard(0).props('pEntity')).toBe('Boulangerie Bel Epi')

    const pHistoryCard = getPHistoryCard(0)
    const geFirstHistoryCardText = pHistoryCard.text()
    expect(geFirstHistoryCardText).toContain('Sutton York  delegated the folder to  Jade Fournier.')

    const getFirstButtonDelete = getPHistoryCard(0).findComponent({ name: 'PButton' })
    expect(getFirstButtonDelete.attributes('pdisabled')).toBeDefined()

    const getLastButtonDelete = getPHistoryCard(delegationsHistoryMock.items.length - 1).findComponent({ name: 'PButton' })
    expect(getLastButtonDelete.attributes('pdisabled')).toBe('false')

    const lastHistoryCard = getPHistoryCard(delegationsHistoryMock.items.length - 1)
    const lastHistoryCardText = lastHistoryCard.text()
    expect(lastHistoryCardText).toContain('you  delegated the folder to  Gamble Riley.')
  })

  it('can make a search', async () => {
    expect(fetchAccountDelegationsHistory).toHaveBeenCalledOnce()

    const searchValue = 'customSearchValue'
    await wrapper.findComponent({ name: 'FormSearch' }).vm.$emit('search-value-submitted', searchValue)

    expect(fetchAccountDelegationsHistory).toHaveBeenCalledTimes(2)
    expect(fetchAccountDelegationsHistory).toHaveBeenNthCalledWith(
      2,
      Number(CURRENT_ACCOUNT_ID),
      new URLSearchParams({ search: searchValue }),
    )
  })

  it('can delete a delegation and see a success notification', async () => {
    const LAST_DELEGATION_ENABLED_IN_MOCK = delegationsHistoryMock.items[delegationsHistoryMock.items.length - 1]

    const getNotificationSuccess = () => document.body.getElementsByClassName('el-notification success')
    expect(getNotificationSuccess()).toHaveLength(0)

    expect(deleteAccountDelegation).not.toHaveBeenCalled()
    expect(fetchAccountDelegationsHistory).toHaveBeenCalledOnce()

    const pHistoryCard = getPHistoryCard(delegationsHistoryMock.items.length - 1)
    const getLastButtonDelete = pHistoryCard.findComponent({ name: 'PButton' })
    await getLastButtonDelete.trigger('click')

    expect(deleteAccountDelegation).toHaveBeenCalledOnce()
    expect(deleteAccountDelegation).toHaveBeenCalledWith(LAST_DELEGATION_ENABLED_IN_MOCK.delegationId)

    expect(getNotificationSuccess()).toHaveLength(1)

    expect(fetchAccountDelegationsHistory).toHaveBeenCalledTimes(2)
  })
})
