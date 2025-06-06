import { describe, it, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { TopBarManager } from './top-bar.manager'
import TopBar from './top-bar.vue'

vi.mock('./top-bar.manager')

describe('TopBar', () => {
  it.each([
    {
      testName: 'should display PennylaneSSO when isPennylaneSSODisplayed returns true',
      isPennylaneSSODisplayed: true,
      shouldExist: true,
    },
    {
      testName: 'should not display PennylaneSSO when isPennylaneSSODisplayed returns false',
      isPennylaneSSODisplayed: false,
      shouldExist: false,
    },
  ])('$testName', async ({ isPennylaneSSODisplayed, shouldExist }) => {
    vi.mocked(TopBarManager.isPennylaneSSODisplayed).mockReturnValue(isPennylaneSSODisplayed)

    const wrapper = shallowMount(TopBar)

    const pennylaneSSO = wrapper.findComponent({ name: 'PennylaneSSO' })
    expect(TopBarManager.isPennylaneSSODisplayed()).toBe(isPennylaneSSODisplayed)
    expect(pennylaneSSO.exists()).toBe(shouldExist)
  })
})
