import { vi, describe, it, expect, beforeEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'
import { PAlert, PUserAction } from '@kpmg/styleguide'
import type { DelegatorsAddStepProps } from './AddDelegatesStepTypes'
import AddDelegatesStep from '.'
import CollaboratorsSearchAutocomplete from '../CollaboratorsSearchAutocomplete'
import { getMockedCollaborators } from '@/services/contact/contactMocks'

vi.mock('@/services/contact', () => ({
  getCollaborators: vi.fn(() => Promise.resolve(getMockedCollaborators())),
}))

const defaultProps: DelegatorsAddStepProps = {
  numberOfFoldersInPortfolio: 5,
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
  wrapper.findComponent(PUserAction)

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
      const alertWrapper = wrapper.findComponent(PAlert)
      // 5 comes from the base props
      expect(alertWrapper.html()).toContain('5')
    })
  })

  describe('interactions', () => {
    it('should emit collaborator-selection on add-collaborator event', () => {
      collaboratorsSearchAutocompleteWrapper.vm.$emit('add-collaborator', 1)

      const emitted = wrapper.emitted('collaborator-selection')

      expect(emitted).toHaveLength(1)
      expect(emitted?.at(0)).toStrictEqual([[1]])
    })

    it('should emit collaborator-selection on remove-collaborator event', () => {
      // set base content to test remove
      collaboratorsSearchAutocompleteWrapper.vm.$emit('add-collaborator', 1)
      collaboratorsSearchAutocompleteWrapper.vm.$emit('add-collaborator', 2)
      collaboratorsSearchAutocompleteWrapper.vm.$emit('add-collaborator', 3)

      collaboratorsSearchAutocompleteWrapper.vm.$emit('remove-collaborator', 1)

      const emitted = wrapper.emitted('collaborator-selection')
      expect(emitted).toHaveLength(4)
      expect(emitted?.at(3)).toStrictEqual([[2, 3]])
    })

    it('should emit collaborator-selection on user line trash icon click', async () => {
      collaboratorsSearchAutocompleteWrapper.vm.$emit('add-collaborator', 1)
      await nextTick()

      const userLine = findUserAction(wrapper)
      userLine.vm.$emit('click-delete', 1)

      const emitted = wrapper.emitted('collaborator-selection')
      expect(emitted).toHaveLength(2)
      expect(emitted?.at(1)).toStrictEqual([[]])
    })
  })
})
