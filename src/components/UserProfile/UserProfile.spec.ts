import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import UserProfile from './'

vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    gateway: {
      get: () => Promise.resolve({ data: {} }),
    },
  }),
}))

const MY_INFORMATION_CONTENT = 'custom content'

const createWrapper = (): VueWrapper<any> =>
  mount(UserProfile, {
    props: {
      hasDrawerOpened: true,
    },
    global: {
      stubs: {
        MyInformation: {
          name: 'MyInformation',
          template: `<div>${MY_INFORMATION_CONTENT}</div>`,
        },
      },
    },
  })

describe('userProfile', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('displays the information of the user', () => {
    const drawer = document.querySelector('.p-drawer') as HTMLElement
    expect(drawer.innerHTML).toContain(MY_INFORMATION_CONTENT)
  })
})
