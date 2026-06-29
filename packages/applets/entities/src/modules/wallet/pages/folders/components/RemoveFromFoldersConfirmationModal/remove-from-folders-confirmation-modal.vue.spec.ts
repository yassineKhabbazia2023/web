import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import frFR from '@entities/i18n/fr-FR.json'
import RemoveFromFoldersConfirmationModal from './remove-from-folders-confirmation-modal.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'fr-FR',
  messages: {
    'fr-FR': frFR,
  },
})

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
      plugins: [i18n],
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

describe('RemoveFromFoldersConfirmationModal', () => {
  it('displays the standard wording for one selected folder', () => {
    const wrapper = mountComponent({
      selectedFoldersCount: 1,
    })

    expect(wrapper.text()).toContain('Se retirer de ce dossier ?')
    expect(wrapper.text()).toContain('vous perdrez l’accès à ce dossier et il disparaîtra')
  })

  it('displays the standard wording for multiple selected folders', () => {
    const wrapper = mountComponent({
      selectedFoldersCount: 2,
    })

    expect(wrapper.text()).toContain('Se retirer de ces 2 dossiers ?')
    expect(wrapper.text()).toContain('vous perdrez l’accès à ces dossiers et ils disparaîtront')
  })

  it('displays the remaining collaborator wording for one selected folder', () => {
    const wrapper = mountComponent({
      selectedFoldersCount: 1,
      hasRemainingCollaboratorFolder: true,
    })

    expect(wrapper.text()).toContain('Vous êtes le dernier collaborateur')
    expect(wrapper.text()).toContain('Se retirer')
  })

  it('displays the remaining collaborator wording for multiple selected folders', () => {
    const wrapper = mountComponent({
      selectedFoldersCount: 2,
      hasRemainingCollaboratorFolder: true,
    })

    expect(wrapper.text()).toContain('Vous êtes le dernier collaborateur sur l’un de ces dossiers')
  })
})
