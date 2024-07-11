import { describe, it, expect, beforeEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { PCollapse } from '@kpmg/styleguide'
import CollapsableFoldersList from '.'

const i18n = createI18n({
  locale: 'fr-FR',
})

const createWrapper = (): VueWrapper => {
  return mount(CollapsableFoldersList, {
    global: {
      provide: {
        i18n,
      },
    },
  })
}

let wrapper: VueWrapper

describe('collapsable folders list', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  describe('props', () => {
    it('should render', () => {
      const collapseWrapper = wrapper.findComponent(PCollapse)

      expect(collapseWrapper.exists()).toBeTruthy()
    })
  })
})
