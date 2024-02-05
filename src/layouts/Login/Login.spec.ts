/**
 * @jest-environment jsdom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, VueWrapper, flushPromises } from '@vue/test-utils'
import Login from './'
import { LINKS } from './contants'
import { Link } from './types'

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

const createWrapper = () => mount(Login)

describe('login', () => {
  let wrapper: VueWrapper<any> = createWrapper()
  const getLinks = () => wrapper.findAll('.footer .list-item a')

  beforeEach(() => {
    wrapper = createWrapper()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('has links in the footer', () => {
    expect(wrapper.find('.footer').exists()).toBeTruthy()
    expect(getLinks()).toHaveLength(LINKS.length)
  })

  it.each(LINKS)(
    'opens a new tab when clicking on the link at index %#',
    async ({ translationKey, href }: Link) => {
      const linkIndex = LINKS.findIndex(
        ({ translationKey: t }) => t === translationKey
      )
      const link = getLinks()[linkIndex]
      await link.trigger('click')

      expect(window.open).toHaveBeenCalledTimes(1)
      expect(window.open).toHaveBeenCalledWith(href || CGU_URL, '_blank')
    }
  )

  it('can read the copyrights', async () => {
    await flushPromises()
    await vi.dynamicImportSettled()
    const copyrightsLink = wrapper.find('.support + p .link')
    const isDrawerOpen = () => wrapper.find('.p-drawer.open')

    expect(isDrawerOpen().exists()).toBeFalsy()

    await copyrightsLink.trigger('click')
    expect(isDrawerOpen().exists()).toBeTruthy()
  })
})
