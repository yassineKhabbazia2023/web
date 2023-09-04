import { mount } from '@vue/test-utils'
import CreateMandateForm from '.'
import { createI18n } from 'vue-i18n'
import { expect, describe, it, vi } from 'vitest'

vi.mock('@/services/mandate', () => {
  const createMandate = vi.fn(() => ({
    data: {
      id: '140edf1b-0a59-4f70-abbc-052462faa010',
      name: 'MK 2000',
      siretNumber: '50339868700015',
      erpId: '1999072765',
      bankServicesProviderId: '',
      signatory: {
        title: 'M',
        firstName: 'maroo',
        lastName: 'elleuch',
        address: {
          street: 'street',
          complements: 'complement',
          zipCode: 'zipcode',
          city: 'city',
          country: 'contry'
        }
      }
    }
  }))
  return { createMandate }
})

const i18n = createI18n({
  legacy: false,
  locale: 'en-US',
  messages: {
    'en-US': {
      'ibs-number': 'IBS Number',
      'company-name': 'Company name',
      'siret-number': 'SIRET',
      tooltip: 'The IBS number entered must be part of your portfolio and have an active.',
      form: {
        error: {
          requiredField: 'Required field'
        }
      }
    },
    'fr-FR': {
      'ibs-number': 'Numéro IBS',
      'company-name': 'Raison sociale',
      'siret-number': 'N° SIRET',
      tooltip: 'Le numéro d’IBS saisi doit faire parti de votre portefeuille.',
      form: {
        error: {
          requiredField: 'Champ obligatoire'
        }
      }
    }
  }
})

const createWrapper = (props: any = {}) =>
  mount(CreateMandateForm, {
    props,
    global: {
      plugins: [i18n]
    }
  })

describe('form.vue', () => {
  it('renders the component when step value is 1', async () => {
    const wrapper = createWrapper({ step: 1 })
    expect(wrapper.exists()).toBeTruthy()
  })

  it('renders the component when step value is 2', async () => {
    const wrapper = createWrapper({ step: 2 })
    expect(wrapper.exists()).toBeTruthy()
  })

  it('validateIBS when ibs length is equal to 10', async () => {
    const wrapper = createWrapper({ step: 1 })
    wrapper.vm.createMandateForm.ibs = '1999072764'
    wrapper.vm.validateIBS({
      required: true,
      message: '',
      trigger: 'change'
    }, 1999072764, () => true)
    expect(wrapper.exists()).toBeTruthy()
  })

  it('validateIBS when ibs length is not equal to 10', async () => {
    const wrapper = createWrapper({ step: 1 })
    wrapper.vm.validateIBS({
      required: true,
      message: '',
      trigger: 'change'
    }, 199907276, () => true)
    expect(wrapper.exists()).toBeTruthy()
  })

  it('checkAndEmitEvents when fields are not filled', async () => {
    const wrapper = createWrapper({ step: 2 })
    wrapper.vm.createMandateForm.firstName = ''
    wrapper.vm.checkAndEmitEvents()
    expect(wrapper.emitted()['loading-event-form']).toBeTruthy()
  })
})
