import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import LoginCollab from '.'

const CGU_URL = 'https://custom-CGU.com'

vi.mock('@kpmg/common', async () => ({
  commonApi: () => ({
    portal: {
      get: () => ({
        data: {
          value: CGU_URL
        }
      })
    }
  })
}))

const createWrapper = () => mount(LoginCollab)

describe('loginCollab', () => {
  let wrapper: VueWrapper<any> = createWrapper()

  beforeEach(async () => {
    wrapper = createWrapper()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('component rendered correctly', () => {
    expect(wrapper.exists()).toBeTruthy()
  })
})
