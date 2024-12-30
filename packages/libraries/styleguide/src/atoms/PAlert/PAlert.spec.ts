import { vi, describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import PAlert from './'
import type { PAlertProps } from './PAlertTypes'
import { nextTick } from 'vue'

const baseProps: PAlertProps = {
  pType: 'main',
}

const createWrapper = (props: PAlertProps = baseProps) =>
  shallowMount(PAlert, {
    props,
  })

type iconResolvingType = {
  type: PAlertProps['pType']
  expectedIconName: string
}
describe('pAlert', () => {
  describe('props', () => {
    const tests: iconResolvingType[] = [
      {
        type: 'main',
        expectedIconName: 'infoCircle',
      },
      {
        type: 'success',
        expectedIconName: 'checkCircle',
      },
      {
        type: 'warning',
        expectedIconName: 'exclamationTriangle',
      },
      {
        type: 'danger',
        expectedIconName: 'xCircle',
      },
      {
        type: 'information',
        expectedIconName: 'infoCircle',
      },
    ]
    it.each(tests)(
      'should render icon based on type prop',
      async ({ type, expectedIconName }) => {
        const wrapper = createWrapper({ pType: type })
        const iconComponent = wrapper.findComponent({ name: 'PIcon' })
        expect(iconComponent.props('pName')).toBe(expectedIconName)
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
    const wrapper = createWrapper({ pIconName: 'arrowHere' })
    await vi.dynamicImportSettled()
    const pIconComponent = wrapper.findComponent({ name: 'PIcon' })
    expect(pIconComponent.props('pName')).toBe('arrowHere')
  })
})
