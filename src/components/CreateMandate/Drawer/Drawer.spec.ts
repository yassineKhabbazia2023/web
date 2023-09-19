import wrapperFactory from '../../../../tests/utils/wrapperFactory'
import CreateMandateDrawer from '.'
import { expect, describe, it, vi } from 'vitest'
import { waitForAsyncImports } from '@kpmg/common/src/testing-helpers'

const createWrapper = (props: any = {}, slots: any = {}) =>
  wrapperFactory(CreateMandateDrawer, { props, slots })

describe('createMandateDrawer.vue', () => {
  it('renders the component when modelValue is true', async () => {
    const wrapper = createWrapper({ modelValue: true })
    await vi.dynamicImportSettled()
    expect(wrapper.exists()).toBeTruthy()
  })

  it('goToNextStep when currentStep go from 1 to 2', async () => {
    const wrapper = createWrapper({ modelValue: true })
    await waitForAsyncImports(150)
    const nextStepButton = wrapper.find('button[data-testid="next-step-test"]')
    await nextStepButton.trigger('click')
    expect(wrapper.vm.currentStep).toBe(1)
    expect(wrapper.vm.nextStepAvailability).toBeFalsy()
  })
})
