import { PAccordionProps } from './PAccordion.types'
import { shallowMount } from '@vue/test-utils'

import PAccordion from './PAccordion.vue'

const defaultProps: PAccordionProps = {
  pIsOpen: false,
  pHasHeader: false,
  pHeaderCssClass: undefined,
}

function createWrapper(overrideProps: Partial<PAccordionProps> = {}) {
  const props = {
    ...defaultProps,
    ...overrideProps,
  }

  return shallowMount(PAccordion, {
    props,
  })
}
describe('test PAccordion', () => {
  const testsWithHeader = [{
    pIsOpen: false,
    pHasHeader: true,
    expectedEmitsOpenOnHeaderClick: [[]],
    expectedEmitsCloseOnHeaderClick: undefined,
  }, {
    pIsOpen: true,
    pHasHeader: true,
    pHeaderCssClass: '',
    expectedEmitsOpenOnHeaderClick: undefined,
    expectedEmitsCloseOnHeaderClick: [[]],
  }]
  const testsWithoutHeader = [{
    pIsOpen: false,
    pHasHeader: false,
  }, {
    pIsOpen: true,
    pHasHeader: false,
    pHeaderCssClass: '',
  }]

  const tests = [
    ...testsWithHeader,
    ...testsWithoutHeader,
  ]

  it.each(tests)('should return proper html when pIsOpen equals $pIsOpen and pHasHeader equals $pHasHeader', async ({
    pIsOpen,
    pHasHeader,
    pHeaderCssClass,
  }) => {
    const wrapper = createWrapper({
      pIsOpen,
      pHasHeader,
      pHeaderCssClass,
    })

    const snapFilepath = `__snap__/PAccordion.pIsOpen.${pIsOpen ? 'true' : 'false'}.pHasHeader.${pHasHeader ? 'true' : 'false'}.${pHeaderCssClass ?? ''}.html`
    await expect(wrapper.html()).toMatchFileSnapshot(snapFilepath)
  })

  it.each(testsWithHeader)('should emit properly when click on header and pIsOpen equals $pIsOpen', ({
    pIsOpen,
    pHasHeader,
    pHeaderCssClass,
    expectedEmitsOpenOnHeaderClick,
    expectedEmitsCloseOnHeaderClick,
  }) => {
    const wrapper = createWrapper({
      pIsOpen,
      pHasHeader,
      pHeaderCssClass,
    })

    const accordionHeader = wrapper.find('[data-testid="accordion-header"]')
    accordionHeader.trigger('click')

    expect(wrapper.emitted('open')).toStrictEqual(expectedEmitsOpenOnHeaderClick)
    expect(wrapper.emitted('close')).toStrictEqual(expectedEmitsCloseOnHeaderClick)
  })
})
