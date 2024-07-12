import { vi, describe, it, expect, beforeEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'
import { PUserAction } from '@kpmg/styleguide'
import AddDelegatesStep from '.'
import AddCollaboratorsAutocomplete from '../AddCollaboratorsAutocomplete'
import { getMockedCollaborators } from '@/services/contact/contactMocks'
import { getInitials } from '@/helper/helper'
import { getFullName } from '@/common/utils/helpers/helpers'

const mockedCollaborators = getMockedCollaborators()

vi.mock('@/services/account', () => ({
  fetchContactsFromSameHub: vi.fn(() => Promise.resolve(mockedCollaborators)),
}))

const i18n = createI18n({
  locale: 'fr-FR',
})

const createWrapper = (): VueWrapper => {
  return mount(AddDelegatesStep, {
    global: {
      provide: {
        i18n,
      },
    },
  })
}

const findAddCollaboratorsAutocomplete = (wrapper: VueWrapper) =>
  wrapper.findComponent(AddCollaboratorsAutocomplete)

const findUserAction = (wrapper: VueWrapper) =>
  wrapper.findComponent(PUserAction)

let wrapper = createWrapper()
let addCollaboratorsAutocomplete =
  findAddCollaboratorsAutocomplete(wrapper)

describe('add collaborators card', () => {
  beforeEach(() => {
    wrapper = createWrapper()
    addCollaboratorsAutocomplete =
      findAddCollaboratorsAutocomplete(wrapper)
  })

  describe('interactions', () => {
    it('should emit collaborator-selection on add-collaborator event', () => {
      const mockedCollaborator = mockedCollaborators.at(0)
      addCollaboratorsAutocomplete.vm.$emit('add-collaborator', mockedCollaborator)

      const emitted = wrapper.emitted('collaborator-selection')

      expect(emitted).toHaveLength(1)

      const mockWithInitialsAndFullName = [
        {
          ...mockedCollaborator,
          fullName: getFullName(
            mockedCollaborator?.firstName,
            mockedCollaborator?.lastName,
          ),
          initials: getInitials(
            mockedCollaborator?.firstName,
            mockedCollaborator?.lastName,
          ),
        },
      ]
      expect(emitted?.at(0)).toStrictEqual([mockWithInitialsAndFullName])
    })

    it('should emit collaborator-selection on remove-collaborator event', () => {
      // set base content to test remove
      addCollaboratorsAutocomplete.vm.$emit('add-collaborator', mockedCollaborators[0])
      addCollaboratorsAutocomplete.vm.$emit('add-collaborator', mockedCollaborators[1])
      addCollaboratorsAutocomplete.vm.$emit('add-collaborator', mockedCollaborators[2])

      addCollaboratorsAutocomplete.vm.$emit('remove-collaborator', 1)

      const firstMockedCollaborator = mockedCollaborators.at(1)
      const secondMockedCollaborator = mockedCollaborators.at(2)
      const mockWithInitialsAndFullName = [
        {
          ...firstMockedCollaborator,
          fullName: getFullName(
            firstMockedCollaborator?.firstName,
            firstMockedCollaborator?.lastName,
          ),
          initials: getInitials(
            firstMockedCollaborator?.firstName,
            firstMockedCollaborator?.lastName,
          ),
        },
        {
          ...secondMockedCollaborator,
          fullName: getFullName(
            secondMockedCollaborator?.firstName,
            secondMockedCollaborator?.lastName,
          ),
          initials: getInitials(
            secondMockedCollaborator?.firstName,
            secondMockedCollaborator?.lastName,
          ),
        },
      ]
      const emitted = wrapper.emitted('collaborator-selection')
      expect(emitted).toHaveLength(4)
      expect(emitted?.at(3)).toStrictEqual([mockWithInitialsAndFullName])
    })

    it('should emit collaborator-selection on user line trash icon click', async () => {
      addCollaboratorsAutocomplete.vm.$emit('add-collaborator', mockedCollaborators[0])
      await nextTick()

      const accountLine = findUserAction(wrapper)
      accountLine.vm.$emit('click-delete', 1)
      await nextTick()

      const emitted = wrapper.emitted('collaborator-selection')
      expect(emitted).toHaveLength(2)
      expect(emitted?.at(1)).toStrictEqual([[]])
    })
  })
})
