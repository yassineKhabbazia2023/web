import { describe, it, expect, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { PTable } from '@pulse/styleguide/components'
import CollapsableFoldersList from '.'
import type { SelectedFoldersListProps } from './SelectedFoldersListTypes'
import { entitiesMock } from '@entities/../tests/mocks/EntitiesMocks'
import type { Entity } from '@pulse/common'

const i18n = createI18n({
  locale: 'fr-FR',
})

function formatFoldersProps(
  folders: Entity[],
): SelectedFoldersListProps['folders'] {
  return folders.map(({ accountId, accountNumber, legalName, color }) => ({
    id: accountId,
    accountNumber,
    name: legalName,
    avatarColor: color,
  }))
}

const formattedProps = formatFoldersProps(entitiesMock)
const defaultProps: SelectedFoldersListProps = {
  folders: formattedProps,
}

const createWrapper = (
  props: SelectedFoldersListProps = defaultProps,
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

let wrapper = createWrapper()

describe('selected folders list', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  describe('props', () => {
    it('should pass appropriate props', () => {
      const tableWrapper = wrapper.findComponent(PTable)

      expect(tableWrapper.exists()).toBeTruthy()
      expect(tableWrapper.props('pData')).toStrictEqual(formattedProps)
    })
  })
})
