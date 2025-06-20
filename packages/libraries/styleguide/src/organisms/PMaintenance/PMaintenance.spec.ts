import { shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import type { PMaintenanceProps } from './PMaintenance.types'

import PMaintenance from '.'

const defaultProps: PMaintenanceProps = {
  pIllustrationName: 'error-page-1',
}

function createWrapper(override: Partial<PMaintenanceProps> = {}, slots: any = {}) {
  const props = {
    ...defaultProps,
    ...override,
  }
  return shallowMount(PMaintenance, {
    props,
    slots,
  })
}

describe('PMaintenance', () => {
  const tests = [{
    description: 'basicCase',
  }]
  it.each(tests)('should display properly when $description', async ({
    description,
  }) => {
    const wrapper = createWrapper()

    const snapFilepath = `__snap__/PMaintenance.${description}.html`
    await expect(wrapper.html()).toMatchFileSnapshot(snapFilepath)
  })
})
