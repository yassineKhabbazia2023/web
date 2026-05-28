import { shallowMount } from '@vue/test-utils'
import type { POverlayProps } from './POverlay.types'

import POverlay from './POverlay.vue'

describe('POverlay', () => {
  const tests: POverlayProps[] = [{
    pBackgroundColor: undefined,
    pHasOverEffect: false,
  }, {
    pBackgroundColor: undefined,
    pHasOverEffect: true,
  }, {
    pBackgroundColor: 'neutral-gray-500',
    pHasOverEffect: false,
  }, {
    pBackgroundColor: 'neutral-gray-500',
    pHasOverEffect: true,
  }]
  it.each(tests)('should render correctly when pHasOverEffect equals $pHasOverEffect and pBackgroundColor equals $pBackgroundColor', async ({
    pBackgroundColor,
    pHasOverEffect,
  }) => {
    const props: POverlayProps = {
      pBackgroundColor,
      pHasOverEffect,
    }
    const wrapper = shallowMount(POverlay, {
      props,
      slots: {
        default: 'mocked slot content',
      },
    })
    const snapFilePath = `__snap__/POverlay.pBackgroundColor.${pBackgroundColor}.pHasOverEffect.${pHasOverEffect ? 'true' : 'false'}.html`
    await expect(wrapper.html()).toMatchFileSnapshot(snapFilePath)
  })
})
