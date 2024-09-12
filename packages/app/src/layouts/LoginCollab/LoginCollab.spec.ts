
import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LoginCollab from '.'

const createWrapper = () => shallowMount(LoginCollab)

describe('loginCollab', () => {
  const wrapper: VueWrapper<any> = createWrapper()
  it('should correctly display the login collab page', () => {
    const loginImage = wrapper.findComponent({ name: 'PImage' })
    const loginFooter = wrapper.find('[data-testid=login-collab-footer]')

    expect(loginImage.exists()).toBeTruthy()
    expect(loginFooter.exists()).toBeTruthy()
  })
})
