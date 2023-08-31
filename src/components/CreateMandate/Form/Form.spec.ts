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

vi.mock('@kpmg/styleguide', () => {
  const PForm = vi.fn()
  const PIcon = vi.fn()
  const PInput = vi.fn()
  return { PForm, PIcon, PInput }
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
  it('renders the component when modelValue is true', () => {
    const wrapper = createWrapper({ step: 1 })
    const input = wrapper.find('pinput[type=number]')
    // eslint-disable-next-line no-console
    console.log('Input spec ', input.text())
    // await input.setValue('1234567890')
    // eslint-disable-next-line no-console
    console.log('Form spec ', wrapper.html())
    /* expect(wrapper.emitted()).toHaveProperty('loading-event-form')
    expect(wrapper.emitted()).toHaveProperty('next-step-event-form') */
    expect(wrapper.exists()).toBeTruthy()
  })

  /* it('reflects changes in drawerModel when modelValue prop is updated', async () => {
    const wrapper = createWrapper({ step: 1 })

    // Use a helper function to get the drawerModel value
    const getDrawerModel = () => wrapper.props('modelValue')

    expect(getDrawerModel()).toBeFalsy()
    await wrapper.setProps({ modelValue: true })
    expect(getDrawerModel()).toBeTruthy()
  })

  it('emits update:modelValue event when drawerModel value changes', async () => {
    const wrapper = createWrapper({
      step: 1
    })

    wrapper.vm.drawerModel = true
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted()['update:modelValue']).toBeTruthy()
    expect(wrapper.emitted()['update:modelValue'][0]).toStrictEqual([true])
  }) */
})
