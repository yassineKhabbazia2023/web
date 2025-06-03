import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import type { DocumentActionsBarProps } from './DocumentActionsBarTypes'

import DocumentsActionsBar from './DocumentsActionsBar.vue'

const defaultProps: DocumentActionsBarProps = {
  permissions: [''],
  isAnyDocumentSelected: true,
  hasFiltersEnabled: false,
  isCurrentServiceReadOnly: false,
}

const createWrapper = (overriddenProps: Partial<DocumentActionsBarProps> = {}) =>
  mount(DocumentsActionsBar, {
    props: {
      ...defaultProps,
      ...overriddenProps,
    },
  })

const findActionBarLeft = (wrapper: any) => {
  const actionbar = wrapper.find('.documents-actions')
  return actionbar.find('.p-action-bar__left')
}

const findActionBarRight = (wrapper: any) => {
  const actionbar = wrapper.find('.documents-actions')
  return actionbar.find('.p-action-bar__right')
}

const findPactionBar = (wrapper: VueWrapper) => {
  return wrapper.findComponent({ name: 'PActionBar' })
}

describe('documentsActions component', () => {
  it('should render the correct number of left side buttons', async () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBeTruthy()
    await nextTick()
    const leftActionBar = findActionBarLeft(wrapper)
    expect(leftActionBar.exists()).toBeTruthy()
    expect(leftActionBar.findAll('.p-action-bar__left-btn')).toHaveLength(2)
  })

  it('should render the default button download of right side buttons', async () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBeTruthy()
    await nextTick()
    const rightActionBar = findActionBarRight(wrapper)
    expect(rightActionBar.exists()).toBeTruthy()
    expect(rightActionBar.findAll('.p-action-bar__right-btn')).toHaveLength(1)
  })

  it('should render the correct number of right side buttons', async () => {
    const permissions = ['CAN_TRANSMIT_DOCUMENT', 'CAN_MOVE_DOCUMENT']

    const wrapper = createWrapper({ permissions })
    expect(wrapper.exists()).toBeTruthy()
    await nextTick()
    const rightActionBar = findActionBarRight(wrapper)
    expect(rightActionBar.exists()).toBeTruthy()
    expect(rightActionBar.findAll('.p-action-bar__right-btn')).toHaveLength(3)
  })
})

describe('event', () => {
  it('should emit event click', async () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBeTruthy()
    const pActionBarWrapper = findPactionBar(wrapper)
    await nextTick()
    await pActionBarWrapper.vm.$emit('p-action-bar-button-clicked')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('p-action-bar-button-clicked')).toBeTruthy()
  })

  it('should propagate  PactionBar search-expand-change event', async () => {

    const wrapper = createWrapper()
    const pActionBarWrapper = findPactionBar(wrapper)

    await pActionBarWrapper.vm.$emit('search-expand-change', true)
    await nextTick()

    expect(wrapper.emitted('search-expand-change')).toStrictEqual([[true]])
  })

  it('should propagate  PactionBar p-search-input event after the debounce', async () => {
    vi.useFakeTimers()

    const wrapper = createWrapper()
    const pActionBarWrapper = findPactionBar(wrapper)

    await pActionBarWrapper.vm.$emit('p-search-input', 'Hello')
    await nextTick()
    vi.advanceTimersByTime(1000)

    expect(wrapper.emitted('p-search-input')).toStrictEqual([['Hello']])
  })
})
