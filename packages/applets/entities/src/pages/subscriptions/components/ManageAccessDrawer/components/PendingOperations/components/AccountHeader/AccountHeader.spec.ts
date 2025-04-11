
import { getAccountOperationsListMock } from '@entities/__mocks__/operations.mocks'
import { AccountHeaderProps } from './AccountHeader.types'
import { shallowMount } from '@vue/test-utils'

import AccountHeader from './AccountHeader.vue'

const defaultProps: AccountHeaderProps = {
  accountOperations: getAccountOperationsListMock()[0],
}

function createWrapper(overrideProps: Partial<AccountHeaderProps> = {}) {
  const props = {
    ...defaultProps,
    ...overrideProps,
  }

  return shallowMount(AccountHeader, {
    props,
  })
}
describe('test AccountHeader', () => {
  it('should return proper html', () => {
    const wrapper = createWrapper()

    expect(wrapper.html()).toMatchFileSnapshot('__snap__/AccountHeader.html')
  })
})
