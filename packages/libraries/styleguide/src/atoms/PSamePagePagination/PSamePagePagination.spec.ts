import { shallowMount } from '@vue/test-utils'
import PSamePagePagination from './'
import type { PSamePagePaginationProps } from './PSamePagePaginationTypes'

const defaultProps: PSamePagePaginationProps = {
  pLabel: 'Show more results',
}

function createWrapper(props: PSamePagePaginationProps = defaultProps) {
  return shallowMount(PSamePagePagination, {
    props,
    global: {
      stubs: {
        PButton: {
          name: 'PButton',
          template: '<button><slot /></button>',
          props: ['pLoading'],
        },
        PIcon: {
          name: 'PIcon',
          template: '<span />',
          props: ['pName'],
        },
      },
    },
  })
}

describe('pSamePagePagination', () => {
  it('should render the load more label', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain(defaultProps.pLabel)
  })

  it('should forward loading state to the button', () => {
    const wrapper = createWrapper({
      ...defaultProps,
      pLoading: true,
    })

    const button = wrapper.findComponent({ name: 'PButton' })

    expect(button.props('pLoading')).toBe(true)
  })

  it('should emit load-more when the button is clicked', async () => {
    const wrapper = createWrapper()

    await wrapper.findComponent({ name: 'PButton' }).trigger('click')

    expect(wrapper.emitted('load-more')).toStrictEqual([[]])
  })

  it('should render default test id', () => {
    const wrapper = createWrapper()

    const button = wrapper.findComponent({ name: 'PButton' })

    expect(button.attributes('data-testid')).toBe('psame-page-pagination-load-more-button')
  })

  it('should render custom test id root', () => {
    const wrapper = createWrapper({
      ...defaultProps,
      pTestId: 'wallet',
    })

    const button = wrapper.findComponent({ name: 'PButton' })

    expect(button.attributes('data-testid')).toBe('wallet-load-more-button')
  })
})
