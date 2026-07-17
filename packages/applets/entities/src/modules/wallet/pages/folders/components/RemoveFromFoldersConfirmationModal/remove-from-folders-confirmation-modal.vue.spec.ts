import { mount } from '@vue/test-utils'
import { stubUseI18nWithIdentityT } from '@pulse/common/mocks/vitest'
import RemoveFromFoldersConfirmationModal from './remove-from-folders-confirmation-modal.vue'

const I18N_KEY = 'entities.removeFromFoldersConfirmationModal'

function mountComponent({
  selectedFoldersCount = 1,
  hasRemainingCollaboratorFolder = false,
} = {}) {
  return mount(RemoveFromFoldersConfirmationModal, {
    props: {
      modelValue: true,
      selectedFoldersCount,
      hasRemainingCollaboratorFolder,
      isConfirmButtonLoading: false,
    },
    global: {
      stubs: {
        PDialog: {
          template: '<div><slot /><slot name="footer" /></div>',
        },
        PButton: {
          template: '<button><slot /></button>',
        },
        PIcon: {
          template: '<i />',
        },
      },
    },
  })
}

// The identity i18n stub returns the raw key: the specs pin the key choice and
// the interpolated count (which drives the singular/plural wording), not the
// translated text itself.
describe('RemoveFromFoldersConfirmationModal', () => {
  it('displays the standard wording for one selected folder', () => {
    const { t: translateSpy } = stubUseI18nWithIdentityT()

    const wrapper = mountComponent({
      selectedFoldersCount: 1,
    })

    expect(wrapper.text()).toContain(`${I18N_KEY}.title`)
    expect(wrapper.text()).toContain(`${I18N_KEY}.content`)
    expect(translateSpy).toHaveBeenCalledWith(`${I18N_KEY}.title`, 1)
    expect(translateSpy).toHaveBeenCalledWith(`${I18N_KEY}.content`, 1)
  })

  it('displays the standard wording for multiple selected folders', () => {
    const { t: translateSpy } = stubUseI18nWithIdentityT()

    const wrapper = mountComponent({
      selectedFoldersCount: 2,
    })

    expect(wrapper.text()).toContain(`${I18N_KEY}.title`)
    expect(wrapper.text()).toContain(`${I18N_KEY}.content`)
    expect(translateSpy).toHaveBeenCalledWith(`${I18N_KEY}.title`, 2)
    expect(translateSpy).toHaveBeenCalledWith(`${I18N_KEY}.content`, 2)
  })

  it('displays the remaining collaborator wording for one selected folder', () => {
    const { t: translateSpy } = stubUseI18nWithIdentityT()

    const wrapper = mountComponent({
      selectedFoldersCount: 1,
      hasRemainingCollaboratorFolder: true,
    })

    expect(wrapper.text()).toContain(`${I18N_KEY}.remainingCollaboratorTitle`)
    expect(wrapper.text()).toContain(`${I18N_KEY}.remainingCollaboratorContent`)
    expect(translateSpy).toHaveBeenCalledWith(`${I18N_KEY}.remainingCollaboratorTitle`, 1)

    const confirmButton = wrapper.find('[data-testid="remove-from-folders-confirm-button"]')
    expect(confirmButton.text()).toBe(`${I18N_KEY}.remove`)
  })

  it('displays the remaining collaborator wording for multiple selected folders', () => {
    const { t: translateSpy } = stubUseI18nWithIdentityT()

    const wrapper = mountComponent({
      selectedFoldersCount: 2,
      hasRemainingCollaboratorFolder: true,
    })

    expect(wrapper.text()).toContain(`${I18N_KEY}.remainingCollaboratorTitle`)
    expect(translateSpy).toHaveBeenCalledWith(`${I18N_KEY}.remainingCollaboratorTitle`, 2)
  })

  it('displays the standard confirm button label when no remaining collaborator folder is selected', () => {
    const wrapper = mountComponent({
      selectedFoldersCount: 1,
    })

    const confirmButton = wrapper.find('[data-testid="remove-from-folders-confirm-button"]')
    expect(confirmButton.text()).toBe(`${I18N_KEY}.confirm`)
  })
})
