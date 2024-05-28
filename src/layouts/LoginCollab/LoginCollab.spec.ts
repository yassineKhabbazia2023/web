
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import LoginCollab from '.'

const createWrapper = () => mount(LoginCollab)

describe('loginCollab', () => {
  it('can read the copyrights', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    await flushPromises()
    await vi.dynamicImportSettled()
    const copyrightsLink = wrapper.find('.support + p .link')
    const isDrawerOpen = () => wrapper.find('.p-drawer.open')

    expect(isDrawerOpen().exists()).toBeFalsy()
    await copyrightsLink.trigger('click')
    expect(isDrawerOpen().exists()).toBeTruthy()
  })
})
