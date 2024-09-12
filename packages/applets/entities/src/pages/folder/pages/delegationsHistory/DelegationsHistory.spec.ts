import { defineStore } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import delegationsHistoryMock from '@/services/account/__mock__/delegationsHistory.json'
import { deleteAccountDelegation, fetchAccountDelegationsHistory } from '@/services/account/accountServices'
import DelegationsHistory from './'

const CURRENT_ACCOUNT_ID = '602'

const pinia = createTestingPinia()
vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => ({
      user: {
        id: 7,
      },
    }),
  }),
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      id: CURRENT_ACCOUNT_ID,
    },
  }),
}))

vi.mock('@/services/account/accountServices', () => ({
  deleteAccountDelegation: vi.fn(),
  fetchAccountDelegationsHistory: vi.fn(() => Promise.resolve(delegationsHistoryMock)),
}))

const createWrapper = (): VueWrapper<any> =>
  mount(DelegationsHistory, {
    global: {
      plugins: [pinia],
    },
    attachTo: document.body,
  })

describe('delegationsHistory', () => {
  let wrapper: VueWrapper<any>

  const getTimeLineItems = () => wrapper.findAllComponents({ name: 'PTimelineItem' })
  const getPHistoryCard = (index: number) => getTimeLineItems()[index].findComponent({ name: 'PHistoryCard' })

  beforeEach(() => {
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

    const geFirstHistoryCardText = getPHistoryCard(0).find('.p-history-card__text').text()
    expect(geFirstHistoryCardText).toContain('Sutton York  delegated the folder to  Jade Fournier.')

    const getFirstButtonDelete = getPHistoryCard(0).find('button')
    expect(getFirstButtonDelete.attributes('disabled')).toBeDefined()

    const getLastButtonDelete = getPHistoryCard(delegationsHistoryMock.items.length - 1).find('button')
    expect(getLastButtonDelete.attributes('disabled')).toBeUndefined()

    const geLastHistoryCardText = getPHistoryCard(delegationsHistoryMock.items.length - 1)
      .find('.p-history-card__text').text()
    expect(geLastHistoryCardText).toContain('you  delegated the folder to  Gamble Riley.')
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

    const getLastButtonDelete = getPHistoryCard(delegationsHistoryMock.items.length - 1).find('button')
    await getLastButtonDelete.trigger('click')

    expect(deleteAccountDelegation).toHaveBeenCalledOnce()
    expect(deleteAccountDelegation).toHaveBeenCalledWith(LAST_DELEGATION_ENABLED_IN_MOCK.delegationId)

    expect(getNotificationSuccess()).toHaveLength(1)

    expect(fetchAccountDelegationsHistory).toHaveBeenCalledTimes(2)
  })
})
