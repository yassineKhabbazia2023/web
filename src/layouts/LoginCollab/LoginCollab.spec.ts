
import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LoginCollab from '.'

const createWrapper = () => shallowMount(LoginCollab)

describe('loginCollab', () => {
  const wrapper: VueWrapper<any> = createWrapper()
  it('has links in the footer', () => {
    expect(wrapper.find('.footer').exists()).toBeTruthy()
  })
})
