import { shallowMount } from '@vue/test-utils'
import type { CatalogStatusMessageProps } from './catalog-status-message.types'
import type { IconName } from '@pulse/styleguide/types'

import CatalogStatusMessage from './catalog-status-message.vue'

const defaultProps: CatalogStatusMessageProps = {
  message: '',
}
function createWrapper(override: Partial<CatalogStatusMessageProps> = {}, hasSlots = false) {
  const props = {
    ...defaultProps,
    ...override,
  }
  const slots = hasSlots
    ? {
      default: 'Default Slot',
    }
    : undefined
  return shallowMount(CatalogStatusMessage, {
    props,
    globals: {
      slots,
    },
  })
}

describe('catalog-status-message', () => {
  const tests: {
    iconName?: IconName,
    message: string,
    hasSlots: boolean,
    description: string
  }[] = [{
    iconName: 'bell',
    message: 'status message',
    hasSlots: true,
    description: 'nominalCase',
  }, {
    iconName: undefined,
    message: 'status message',
    hasSlots: false,
    description: 'noIconNoSlot',
  }, {
    iconName: 'bell',
    message: '',
    hasSlots: false,
    description: 'noMessageNoSlot',
  }]
  it.each(tests)('should render properly when $description', async ({
    iconName,
    message,
    hasSlots,
    description,
  }) => {
    const wrapper = createWrapper({
      iconName,
      message,
    }, hasSlots)

    const snapFilepath = `__snap__/catalog-status-message.${description}.html`
    await expect(wrapper.html()).toMatchFileSnapshot(snapFilepath)
  })
})
