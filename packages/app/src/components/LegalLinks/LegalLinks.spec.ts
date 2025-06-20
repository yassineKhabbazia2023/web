import { shallowMount, flushPromises } from '@vue/test-utils'
import type { LegalLinksProps } from './LegalLinks.types'

import LegalLinks from '.'

vi.mock('vue-router')

const defaultProps: LegalLinksProps = {
  dark: false,
  hasCgu: false,
}

async function createWrapper(override: Partial<LegalLinksProps> = {}) {
  const props = {
    ...defaultProps,
    ...override,
  }

  const wrapper = shallowMount(LegalLinks, {
    props,
  })
  await flushPromises()

  return wrapper
}

describe('legalLinks', () => {
  const tests = [{
    dark: false,
    hasCgu: false,
    description: 'NOT-dark',
  }, {
    dark: true,
    hasCgu: false,
    description: 'dark',
  }, {
    dark: false,
    hasCgu: true,
    description: 'with-cgu',
  }]
  it.each(tests)('should render properly when $description', async ({
    dark,
    description,
  }) => {
    const wrapper = await createWrapper({
      dark,
    })
    const snapFilePath = `__snap__/LegalLink.${description}.html`
    await expect(wrapper.html()).toMatchFileSnapshot(snapFilePath)
  })
})
