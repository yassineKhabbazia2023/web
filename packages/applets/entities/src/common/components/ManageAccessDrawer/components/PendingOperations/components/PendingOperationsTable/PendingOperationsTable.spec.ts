import { getMockedOperations } from '@entities/__mocks__/operations.mocks'
import { shallowMount } from '@vue/test-utils'
import { OperationStatus, type Operation } from '@entities/common/types/OperationTypes'

import PendingOperationsTable from './PendingOperationsTable.vue'

const operationsMock = getMockedOperations()

function createWrapper(operation: Operation) {
  return shallowMount(PendingOperationsTable, {
    props: {
      pendingOperations: operationsMock,
    },
    global: {
      stubs: {
        PTable: {
          name: 'PTable',
          template: '<div><slot /></div>',
        },
        PTooltip: {
          name: 'PTooltip',
          template: '<div><slot /></div>',
        },
        PTableColumn: {
          name: 'PTableColumn',
          template: '<div><slot :row="row" /></div>',
          data() {
            return {
              row: operation,
            }
          },
        },
      },
    },
  })
}

describe('test PendingOperationsTable', () => {
  it('when operation is PENDING', async () => {
    const operationStatus = OperationStatus.PENDING

    const operationMock = operationsMock[0]
    operationMock.status = operationStatus

    const wrapper = createWrapper(operationMock)

    const snapfilePath = `__snap__/PendingOperationsTable.${operationStatus}.html`

    const buttons = wrapper.findAllComponents({ name: 'PButton' })
    const rejectAccessButton = buttons[0]
    const approveAccessButton = buttons[1]

    rejectAccessButton.trigger('click')
    approveAccessButton.trigger('click')

    expect(rejectAccessButton.props('pDisabled')).toBe(false)
    expect(approveAccessButton.props('pDisabled')).toBe(false)

    await expect(wrapper.html()).toMatchFileSnapshot(snapfilePath)
    expect(wrapper.emitted('approve-operation')).toStrictEqual([[operationMock]])
    expect(wrapper.emitted('reject-operation')).toStrictEqual([[operationMock]])
  })

  it('when operation is APPROVED', async () => {
    const operationStatus = OperationStatus.APPROVED

    const operationMock = operationsMock[0]
    operationMock.status = operationStatus

    const wrapper = createWrapper(operationMock)

    const snapfilePath = `__snap__/PendingOperationsTable.${operationStatus}.html`

    const rejectAccessButton = wrapper.findComponent('[data-testid="reject-access-button"]')

    const buttons = wrapper.findAllComponents({ name: 'PButton' })
    const approveAccessButton = buttons[0]

    approveAccessButton.trigger('click')

    expect(rejectAccessButton.exists()).toBe(false)
    expect(approveAccessButton.props('pDisabled')).toBe(true)
    expect(approveAccessButton.attributes('data-testid')).toBe('approve-access-button')
    await expect(wrapper.html()).toMatchFileSnapshot(snapfilePath)
  })
})
