import { expect, describe, it, beforeEach, beforeAll } from 'vitest'
import { shallowMount, type DOMWrapper, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import { getMockedDeadlineAccount } from '@app/__mocks__/deadline.mocks'
import type { DeadlineAccountsProps } from './DeadlineAccountsTypes'

import DeadlineAccounts from '.'

const title = 'Destinataires'
const mockedMockedDeadlineAccountDONE = getMockedDeadlineAccount(1, 'Done')
const mockedMockedDeadlineAccountTODO = getMockedDeadlineAccount(2, 'Todo')

const deadlineAccounts = [
  mockedMockedDeadlineAccountDONE,
  mockedMockedDeadlineAccountTODO,
]

const createWrapper = (override: Partial<DeadlineAccountsProps> = {}) => {
  const defaultProps: DeadlineAccountsProps = {
    title,
    deadlineAccounts,
  }
  const props = {
    ...defaultProps,
    ...override,
  }

  return shallowMount(DeadlineAccounts, {
    props,
    global: {
      stubs: {
        PFormItem: {
          name: 'PFormItem',
          template: '<div><slot /></div>',
          props: ['pLabel'],
        },
        PCheckbox: {
          name: 'PCheckbox',
          template: '<div><slot /></div>',
          props: ['modelValue'],
          emits: ['update:model-value'],
        },
      },
    },
  })
}

describe('test DeadlineAccounts', () => {
  let wrapper: VueWrapper
  let deadlineAccounts: DOMWrapper<Element>[]

  beforeAll(async () => {
    wrapper = createWrapper()
    await nextTick()
    deadlineAccounts = wrapper.findAll('[data-testid="occurrence-accounts-row"]')
  })

  it('should display proper title', () => {
    const PFormItem = wrapper.findComponent({ name: 'PFormItem' })
    expect(PFormItem.props('pLabel')).toBe(title)
  })

  it('should emit toggle-status when PCheckbox emits update:model-value', () => {
    const doneDeadlineAccount = deadlineAccounts[0]
    const todoDeadlineAccount = deadlineAccounts[1]

    const pCheckboxDone = doneDeadlineAccount.findComponent({ name: 'PCheckbox' })
    const pCheckboxTodo = todoDeadlineAccount.findComponent({ name: 'PCheckbox' })

    const { id: idDone, status: statusDone } = mockedMockedDeadlineAccountDONE
    const { id: idTodo, status: statusTodo } = mockedMockedDeadlineAccountTODO

    pCheckboxDone.vm.$emit('update:model-value')
    pCheckboxTodo.vm.$emit('update:model-value')

    expect(wrapper.emitted('toggle-status')).toStrictEqual([
      [idDone, statusDone],
      [idTodo, statusTodo],
    ])
  })

  describe('on done deadline account', () => {
    let doneDeadlineAccount: DOMWrapper<Element>
    let deadlineAccountName: DOMWrapper<Element>
    let deadlineAccountId: DOMWrapper<Element>

    beforeEach(() => {
      doneDeadlineAccount = deadlineAccounts[0]
      deadlineAccountName = doneDeadlineAccount.find('[data-testid="occurrence-accounts-row-name"]')
      deadlineAccountId = doneDeadlineAccount.find('[data-testid="occurrence-accounts-row-id"]')
    })

    it('should set proper props', () => {
      const pCheckbox = doneDeadlineAccount.findComponent({ name: 'PCheckbox' })
      expect(pCheckbox.props('modelValue')).toBeTruthy()
    })

    it('should display proper texts', () => {
      expect(deadlineAccountName.text()).toBe(mockedMockedDeadlineAccountDONE.name)
      expect(deadlineAccountId.text()).toBe(`${mockedMockedDeadlineAccountDONE.id}`)
    })

    it('should display proper css classes', () => {
      expect(doneDeadlineAccount.classes()).toContain('occurrence-accounts__row--done')
      expect(deadlineAccountName.classes()).toContain('text-color--neutral-gray-300')
      expect(deadlineAccountId.classes()).toContain('text-color--neutral-gray-300')
    })
  })

  describe('on todo deadline account', () => {
    let todoDeadlineAccount: DOMWrapper<Element>
    let deadlineAccountName: DOMWrapper<Element>
    let deadlineAccountId: DOMWrapper<Element>

    beforeEach(() => {
      todoDeadlineAccount = deadlineAccounts[1]
      deadlineAccountName = todoDeadlineAccount.find('[data-testid="occurrence-accounts-row-name"]')
      deadlineAccountId = todoDeadlineAccount.find('[data-testid="occurrence-accounts-row-id"]')
    })

    it('should set proper props', () => {
      const pCheckbox = todoDeadlineAccount.findComponent({ name: 'PCheckbox' })
      expect(pCheckbox.props('modelValue')).toBeFalsy()
    })

    it('should display proper texts', () => {
      expect(deadlineAccountName.text()).toBe(mockedMockedDeadlineAccountTODO.name)
      expect(deadlineAccountId.text()).toBe(`${mockedMockedDeadlineAccountTODO.id}`)
    })

    it('should display proper css classes', () => {
      expect(todoDeadlineAccount.classes()).not.toContain('occurrence-accounts__row--done')
      expect(deadlineAccountName.classes()).toContain('text-color--neutral-gray-900')
      expect(deadlineAccountId.classes()).toContain('text-color--neutral-gray-500')
    })
  })
})
