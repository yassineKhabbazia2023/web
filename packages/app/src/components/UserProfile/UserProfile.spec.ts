import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import UserProfile from './'
import { nextTick } from 'vue'

vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    gateway: {
      get: () => Promise.resolve({ data: {} }),
    },
  }),
  dataProvider: () => {
    return {
      fetchUserData: vi.fn(),
    }
  },
}))

const MY_INFORMATION_CONTENT = 'custom content'

const createWrapper = (): VueWrapper<any> =>
  shallowMount(UserProfile, {
    props: {
      hasDrawerOpened: true,
    },
    global: {
      stubs: {
        MyInformation: {
          name: 'MyInformation',
          template: `<div>${MY_INFORMATION_CONTENT}</div>`,
        },
        PDrawer: {
          name: 'PDrawer',
          template: '<div><slot /></div>',
          events: ['close-drawer-button'],
        },
      },
    },
  })

describe('userProfile', () => {
  let wrapper: VueWrapper
  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('displays the information of the user', () => {
    expect(wrapper.html()).toContain(MY_INFORMATION_CONTENT)
  })

  it('should update:modelValue=false when click on close-drawer-button', async () => {
    const pDrawer = wrapper.findComponent({ name: 'PDrawer' })
    pDrawer.vm.$emit('close-drawer-button', false)
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
  })

  it('should update:modelValue=false when drawer closes', async () => {
    const pDrawer = wrapper.findComponent({ name: 'PDrawer' })
    pDrawer.vm.$emit('update:model-value', false)
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
  })
})
