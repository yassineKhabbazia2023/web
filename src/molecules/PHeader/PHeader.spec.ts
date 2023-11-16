import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import wrapperFactory from '@tests/utils/wrapperFactory'
import { nextTick } from 'vue'
import PHeader from '.'

describe('pHeader', () => {
  it('should display the header component', async () => {
    const wrapper = wrapperFactory(PHeader, { props: { pHeaderMenu: [] } })
    await nextTick()
    await flushPromises()
    const elMenu = wrapper.find('.el-menu--header')
    const logoSlot = wrapper.find('.menu-item--logo')
    const headerRightSlot = wrapper.find('.p-header-right')
    expect(elMenu.exists()).toBeTruthy()
    expect(logoSlot.exists()).toBeTruthy()
    expect(headerRightSlot.exists()).toBeTruthy()
  })

  it('should display the header with custom logo, menu items and buton logout', async () => {
    const wrapper = wrapperFactory(PHeader, {
      slots: {
        logo: '<span>Custom Logo</span>',
        menu: '<ul><li>Item 1</li><li>Item 2</li></ul>',
        'header-right': '<button>Logout</button>'
      },
      props: { pHeaderMenu: [] }
    })

    await nextTick()
    await flushPromises()
    const logoSlot = wrapper.find('.menu-item--logo')
    expect(logoSlot.text()).toBe('Custom Logo')

    const menuItems = wrapper.findAll('ul li')
    expect(menuItems).toHaveLength(2)
    expect(menuItems[0].text()).toBe('Item 1')
    expect(menuItems[1].text()).toBe('Item 2')

    const headerRightSlot = wrapper.find('.p-header-right')
    expect(headerRightSlot.text()).toBe('Logout')
  })
})
