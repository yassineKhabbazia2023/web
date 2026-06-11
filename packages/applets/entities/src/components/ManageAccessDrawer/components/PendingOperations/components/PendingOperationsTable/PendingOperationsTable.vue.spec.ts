import { shallowMount, type VueWrapper } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { formatPhoneNumber } from '@pulse/toolbox/utils/string'
import type { Operation } from '@entities/types'
import { OperationStatus } from '@entities/enums'
import PendingOperationsTable from './PendingOperationsTable.vue'

const baseOperation: Operation = {
  operationId: 1,
  roleId: '22',
  accountNumber: '2024677022',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  status: OperationStatus.PENDING,
  creationDate: '2024-03-21T11:18:23.9366667',
  isSignatory: false,
}

const signatoryWithPhone: Operation = {
  ...baseOperation,
  isSignatory: true,
  mobilePhone: '0512124423',
}

const signatoryWithoutPhone: Operation = {
  ...baseOperation,
  operationId: 2,
  email: 'jane.smith@example.com',
  isSignatory: true,
}

const nonSignatoryWithPhone: Operation = {
  ...baseOperation,
  operationId: 3,
  email: 'bob.johnson@example.com',
  isSignatory: false,
  mobilePhone: '0612345678',
}

const createWrapper = (operations: Operation[]): VueWrapper<any> =>
  shallowMount(PendingOperationsTable, {
    props: { pendingOperations: operations },
    global: {
      stubs: {
        PTable: {
          name: 'PTable',
          template: '<div><slot /></div>',
        },
        PTableColumn: {
          name: 'PTableColumn',
          template: '<div><slot v-for="row in rows" :key="row.operationId" :row="row" /></div>',
          data: () => ({ rows: operations }),
        },
      },
    },
  })

describe('pendingOperationsTable', () => {
  it('displays the "Signataire" tag when the user is a signatory', () => {
    const wrapper = createWrapper([signatoryWithPhone])

    const tag = wrapper.find('[data-testid="user-signatory-tag"]')
    expect(tag.exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'PTag' }).props('pContent')).toBe('Signatory')
  })

  it('does not display the "Signataire" tag when the user is not a signatory', () => {
    const wrapper = createWrapper([nonSignatoryWithPhone])

    expect(wrapper.find('[data-testid="user-signatory-tag"]').exists()).toBe(false)
  })

  it('displays the formatted mobile phone number when it is present', () => {
    const wrapper = createWrapper([signatoryWithPhone])

    const phone = wrapper.find('[data-testid="user-mobile-phone"]')
    expect(phone.exists()).toBe(true)
    expect(phone.text()).toContain(formatPhoneNumber(signatoryWithPhone.mobilePhone))
    expect(wrapper.find('[data-testid="user-missing-phone"]').exists()).toBe(false)
  })

  it('displays the "Missing number" alert when the mobile phone is missing', () => {
    const wrapper = createWrapper([signatoryWithoutPhone])

    const missing = wrapper.find('[data-testid="user-missing-phone"]')
    expect(missing.exists()).toBe(true)
    expect(missing.text()).toContain('Missing phone number')
    // Only the label is red; the "|" separator keeps the default color.
    const redLabel = missing.find('.text-color--red-800')
    expect(redLabel.text()).toBe('Missing phone number')
    expect(wrapper.find('[data-testid="user-mobile-phone"]').exists()).toBe(false)
  })

  it('renders each user independently with its own signatory status and phone', () => {
    const wrapper = createWrapper([
      signatoryWithPhone,
      signatoryWithoutPhone,
      nonSignatoryWithPhone,
    ])

    expect(wrapper.findAll('[data-testid="user-signatory-tag"]')).toHaveLength(2)
    expect(wrapper.findAll('[data-testid="user-mobile-phone"]')).toHaveLength(2)
    expect(wrapper.findAll('[data-testid="user-missing-phone"]')).toHaveLength(1)
  })
})
