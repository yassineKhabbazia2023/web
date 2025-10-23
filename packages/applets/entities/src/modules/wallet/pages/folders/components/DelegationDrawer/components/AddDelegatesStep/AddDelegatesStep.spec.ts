import { shallowMount } from '@vue/test-utils'
import { nextTick } from 'vue'
import type { DelegatorsAddStepProps } from './AddDelegatesStepTypes'
import { getMockedCollaborators2 } from '@entities/__mocks__/collaborators.mocks'

import AddDelegatesStep from '.'

const mockedCollaborators = getMockedCollaborators2()
vi.mock('@entities/services/wallet', () => ({
  getCollaborators: vi.fn(() => Promise.resolve({
    items: mockedCollaborators,
  })),
}))

vi.mock('@pulse/common/managers')

const defaultProps: DelegatorsAddStepProps = {
  numberOfFoldersInPortfolio: 5,
  shouldDisplayNumberOfFoldersInPortfolio: true,
  hasPennylaneAccess: false,
}

const createWrapper = (
  overriddenProps: Partial<DelegatorsAddStepProps> = {},
) => {
  const props = {
    ...defaultProps,
    ...overriddenProps,
  }

  return shallowMount(AddDelegatesStep, {
    props,
    global: {
      stubs: {
        PBlockHeader: {
          name: 'PBlockHeader',
          template: '<div><slot /><slot name="subtitle" /><slot name="suffix" /></div>',
        },
        PAlert: {
          name: 'PAlert',
          template: '<div><slot /></div>',
        },
        'i18n-t': {
          template: '<div><slot name="amount" /></div>',
        },
      },
    },
  })
}

describe('addDelegatesStep', () => {
  let wrapper: ReturnType<typeof createWrapper>
  beforeEach(() => {
    wrapper = createWrapper()
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
      const collaboratorsSearchAutocompleteWrapper = wrapper.findComponent({ name: 'CollaboratorsSearchAutocomplete' })

      collaboratorsSearchAutocompleteWrapper.vm.$emit('add-collaborator', mockedCollaborators[0])

      const emitted = wrapper.emitted('collaborator-selection')

      expect(emitted).toHaveLength(1)
      expect(emitted?.at(0)).toStrictEqual([[mockedCollaborators.at(0)]])
    })

    it('should emit collaborator-selection on remove-collaborator event', () => {
      const collaboratorsSearchAutocompleteWrapper = wrapper.findComponent({ name: 'CollaboratorsSearchAutocomplete' })

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
      const collaboratorsSearchAutocompleteWrapper = wrapper.findComponent({ name: 'CollaboratorsSearchAutocomplete' })

      collaboratorsSearchAutocompleteWrapper.vm.$emit('add-collaborator', mockedCollaborators[0])
      await nextTick()

      const userLine = wrapper.findComponent({ name: 'PUserAction' })
      userLine.vm.$emit('click-delete', 1)

      const emitted = wrapper.emitted('collaborator-selection')
      expect(emitted).toHaveLength(2)
      expect(emitted?.at(1)).toStrictEqual([[]])
    })
  })
})
