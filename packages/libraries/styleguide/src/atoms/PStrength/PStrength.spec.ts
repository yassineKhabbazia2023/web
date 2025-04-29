import { shallowMount } from '@vue/test-utils'
import type { PStrengthLevel, PStrengthProps } from './PStrength.types'
import { strengthLabelsMock } from './PStrength.mocks'
import PStrength from './'

const defaultProps: PStrengthProps = {
  modelValue: 0,
  labels: strengthLabelsMock,
}

function createWrapper(overriddenProps: Partial<PStrengthProps> = {}) {
  const props = {
    ...defaultProps,
    ...overriddenProps,
  }

  return shallowMount(PStrength, {
    props,
  })
}

describe('test PStrength', () => {
  const tests: PStrengthLevel[] = [
    0,
    1,
    2,
    3,
    4,
  ]
  it.each(tests)('should display properly', async (modelValue) => {
    const wrapper = createWrapper({
      modelValue,
    })

    await expect(wrapper.html()).toMatchFileSnapshot(`__snap__/PStrength.${modelValue}.snap`)
  })
})
