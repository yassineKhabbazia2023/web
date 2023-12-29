import { mount } from '@vue/test-utils'
import DocumentsActionsBar from './DocumentsActionsBar.vue'
import { describe, expect, it } from 'vitest'
import { createPinia } from 'pinia'
import { nextTick } from 'vue'
import { PActionBar } from '@kpmg/styleguide'
import { DocumentActionsBarProps } from './DocumentActionsBarTypes'
const pinia = createPinia()

const createWrapper = (props: DocumentActionsBarProps) =>
  mount(DocumentsActionsBar, {
    props,
    global: {
      plugins: [pinia]
    }
  })

const findActionBarLeft = (wrapper: any) => {
  const actionbar = wrapper.find('.documents-actions')
  return actionbar.find('.p-action-bar__left')
}

const findActionBarRight = (wrapper: any) => {
  const actionbar = wrapper.find('.documents-actions')
  return actionbar.find('.p-action-bar__right')
}
describe('documentsActions component', () => {
  it('should render the correct number of left side buttons', async () => {
    const permissions = ['']
    const isAnyDocumentSelected = true

    const wrapper = createWrapper({ permissions, isAnyDocumentSelected })
    expect(wrapper.exists()).toBeTruthy()
    await nextTick()
    const leftActionBar = findActionBarLeft(wrapper)
    expect(leftActionBar.exists()).toBeTruthy()
    expect(leftActionBar.findAll('.p-action-bar__left-btn')).toHaveLength(3)
  })

  it('should render the default button download of right side buttons', async () => {
    const permissions = ['']
    const isAnyDocumentSelected = true
    const wrapper = createWrapper({ permissions, isAnyDocumentSelected })
    expect(wrapper.exists()).toBeTruthy()
    await nextTick()
    const rightActionBar = findActionBarRight(wrapper)
    expect(rightActionBar.exists()).toBeTruthy()
    expect(rightActionBar.findAll('.p-action-bar__right-btn')).toHaveLength(1)
  })

  it('should render the correct number of right side buttons', async () => {
    const permissions = ['CAN_TRANSMIT_DOCUMENT', 'CAN_MOVE_DOCUMENT']
    const isAnyDocumentSelected = true
    const wrapper = createWrapper({ permissions, isAnyDocumentSelected })
    expect(wrapper.exists()).toBeTruthy()
    await nextTick()
    const rightActionBar = findActionBarRight(wrapper)
    expect(rightActionBar.exists()).toBeTruthy()
    expect(rightActionBar.findAll('.p-action-bar__right-btn')).toHaveLength(3)
  })
})
describe('event', () => {
  it('should emit event click', async () => {
    const permissions = ['']
    const isAnyDocumentSelected = true
    const wrapper = createWrapper({ permissions, isAnyDocumentSelected })
    expect(wrapper.exists()).toBeTruthy()
    const pActionBarWrapper = wrapper.findComponent(PActionBar)
    await nextTick()
    await pActionBarWrapper.vm.$emit('p-action-bar-button-clicked')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('p-action-bar-button-clicked')).toBeTruthy()
  })
})
