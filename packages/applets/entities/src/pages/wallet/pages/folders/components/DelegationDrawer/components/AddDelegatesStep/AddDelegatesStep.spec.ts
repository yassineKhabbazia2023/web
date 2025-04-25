import { vi, describe, it, expect, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'
import type { DelegatorsAddStepProps } from './AddDelegatesStepTypes'
import AddDelegatesStep from '.'
import CollaboratorsSearchAutocomplete from '../CollaboratorsSearchAutocomplete'
import { getMockedCollaborators2 } from '@entities/__mocks__/collaborators.mocks'

const mockedCollaborators = getMockedCollaborators2()
vi.mock('@entities/services/wallet', () => ({
  getCollaborators: vi.fn(() => Promise.resolve({
    items: mockedCollaborators,
  })),
}))

const defaultProps: DelegatorsAddStepProps = {
  numberOfFoldersInPortfolio: 5,
  shouldDisplayNumberOfFoldersInPortfolio: true,
}

const i18n = createI18n({
  locale: 'fr-FR',
})

const createWrapper = (
  props: DelegatorsAddStepProps = defaultProps,
): VueWrapper => {
  return mount(AddDelegatesStep, {
    props,
    global: {
      provide: {
        i18n,
      },
    },
  })
}

const findCollaboratorSearchAutocomplete = (wrapper: VueWrapper) =>
  wrapper.findComponent(CollaboratorsSearchAutocomplete)

const findUserAction = (wrapper: VueWrapper) =>
  wrapper.findComponent({ name: 'PUserAction' })

let wrapper = createWrapper()
let collaboratorsSearchAutocompleteWrapper =
  findCollaboratorSearchAutocomplete(wrapper)

describe('addDelegatesStep', () => {
  beforeEach(() => {
    wrapper = createWrapper()
    collaboratorsSearchAutocompleteWrapper = findCollaboratorSearchAutocomplete(wrapper)
  })

  describe('props', () => {
    it('should correctly pass the number of folders in portfolio', () => {
      const alertWrapper = wrapper.findComponent({ name: 'PAlert' })
      // 5 comes from the base props
      expect(alertWrapper.html()).toContain('5')
    })
  })

  describe('interactions', () => {
    it('should emit collaborator-selection on add-collaborator event', () => {
      collaboratorsSearchAutocompleteWrapper.vm.$emit('add-collaborator', mockedCollaborators[0])

      const emitted = wrapper.emitted('collaborator-selection')

      expect(emitted).toHaveLength(1)
      expect(emitted?.at(0)).toStrictEqual([[mockedCollaborators.at(0)]])
    })

    it('should emit collaborator-selection on remove-collaborator event', () => {
      // set base content to test remove
      collaboratorsSearchAutocompleteWrapper.vm.$emit('add-collaborator', mockedCollaborators[0])
      collaboratorsSearchAutocompleteWrapper.vm.$emit('add-collaborator', mockedCollaborators[1])
      collaboratorsSearchAutocompleteWrapper.vm.$emit('add-collaborator', mockedCollaborators[2])

      collaboratorsSearchAutocompleteWrapper.vm.$emit('remove-collaborator', 1)

      const emitted = wrapper.emitted('collaborator-selection')
      expect(emitted).toHaveLength(4)
      expect(emitted?.at(3)).toStrictEqual([
        [mockedCollaborators.at(1), mockedCollaborators.at(2)],
      ])
    })

    it('should emit collaborator-selection on user line trash icon click', async () => {
      collaboratorsSearchAutocompleteWrapper.vm.$emit('add-collaborator', mockedCollaborators[0])
      await nextTick()

      const userLine = findUserAction(wrapper)
      userLine.vm.$emit('click-delete', 1)

      const emitted = wrapper.emitted('collaborator-selection')
      expect(emitted).toHaveLength(2)
      expect(emitted?.at(1)).toStrictEqual([[]])
    })
  })
})
