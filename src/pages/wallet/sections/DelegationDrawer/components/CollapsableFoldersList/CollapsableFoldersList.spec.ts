import { describe, it, expect, beforeEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { PCollapse, PTable } from '@kpmg/styleguide'
import CollapsableFoldersList from '.'
import type { CollapsableFoldersListProps } from './CollapsableFoldersListTypes'
import { entityMock } from '@/../tests/mocks/EntitiesMocks'

const defaultProps: CollapsableFoldersListProps = {
  folders: [entityMock],
}

const i18n = createI18n({
  locale: 'fr-FR',
})

const createWrapper = (
  props: CollapsableFoldersListProps = defaultProps,
): VueWrapper => {
  return mount(CollapsableFoldersList, {
    props,
    global: {
      provide: {
        i18n,
      },
    },
  })
}

const findTableWrapper = (wrapper: VueWrapper) => wrapper.findComponent(PTable)

let wrapper = createWrapper()

describe('addDelegatesStep', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  describe('props', () => {
    it('should render table inside collapse', () => {
      const collapseWrapper = wrapper.findComponent(PCollapse)
      const tableWrapper = findTableWrapper(wrapper)

      expect(collapseWrapper.exists()).toBeTruthy()
      expect(tableWrapper.exists()).toBeTruthy()
    })
  })
})
