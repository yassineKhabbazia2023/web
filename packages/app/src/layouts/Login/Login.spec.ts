/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import Login from './'

const createWrapper = () => shallowMount(Login)

describe('login', () => {
  const wrapper: VueWrapper<any> = createWrapper()

  it('has links in the footer', () => {
    expect(wrapper.find('.footer').exists()).toBeTruthy()
  })
})
