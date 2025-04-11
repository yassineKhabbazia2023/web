import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AccountInformation from '.'
import type { AccountInformationProps } from './AccountInformationTypes'

const defaultProps: AccountInformationProps = {
  accountName: 'A cool entity',
  accountNumber: 'accountNumber',

}

const createWrapper = (
  props: AccountInformationProps = defaultProps,
) => {
  return mount(AccountInformation, {
    props,
  })
}

describe('rendering', () => {
  it('should display the appropriate data', () => {
    const wrapper = createWrapper()

    expect(wrapper.html()).toContain(defaultProps.accountName)
    expect(wrapper.html()).toContain(defaultProps.accountNumber)
  })
})
