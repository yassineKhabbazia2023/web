import { vi, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PAlert from './'
import type { PAlertProps } from './PAlertTypes'
import { nextTick } from 'vue'

const baseProps: PAlertProps = {
  pType: 'main',
}

const createWrapper = (props: PAlertProps = baseProps) =>
  mount(PAlert, {
    props,
  })

type iconResolvingType = {
  type: PAlertProps['pType']
  expectedIconToResolve: string
}
describe('pAlert', () => {
  describe('props', () => {
    it.each([
      {
        type: 'main',
        expectedIconToResolve: 'PIInfoCircle',
      },
      {
        type: 'success',
        expectedIconToResolve: 'PICheckCircle',
      },
      {
        type: 'warning',
        expectedIconToResolve: 'PIExclamationTriangle',
      },
      {
        type: 'danger',
        expectedIconToResolve: 'PIXCircle',
      },
      {
        type: 'information',
        expectedIconToResolve: 'PIInfoCircle',
      },
    ] as Array<iconResolvingType>)(
      'should render icon based on type prop',
      async ({ type, expectedIconToResolve }) => {
        const wrapper = createWrapper({ pType: type })
        await vi.dynamicImportSettled()
        const iconComponent = wrapper.findComponent({ name: expectedIconToResolve })
        expect(iconComponent.exists()).toBeTruthy()
      },
    )
  })
  it('should emits close-alert', async () => {
    const wrapper = createWrapper({ pClosable: true })
    const secondIcons = wrapper.findAllComponents({ name: 'PIcon' }).at(1)
    secondIcons?.trigger('click')
    await nextTick()
    expect(wrapper.emitted('close')).toBeTruthy()
  })
  it('should show the arrow icon', async () => {
    const wrapper = createWrapper({ pIcon: 'arrowHere' })
    await vi.dynamicImportSettled()
    const pIconComponent = wrapper.findComponent({ name: 'PIcon' })
    expect(pIconComponent.props('pName')).toBe('arrowHere')
  })
})
