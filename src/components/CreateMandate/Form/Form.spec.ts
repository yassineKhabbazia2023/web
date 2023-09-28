import CreateMandateForm from '.'
import wrapperFactory from '../../../../tests/utils/wrapperFactory'
import { expect, describe, it, vi } from 'vitest'
import {
  waitForAsyncImports,
  dynamicUntilFoundComponent
} from '@kpmg/common/src/testing-helpers'
import { PForm, PFormItem, PInput, PCol, PRow } from '@kpmg/styleguide'

// vi.mock('@/services/mandate', () => {
//   const createMandate = vi.fn(() => ({
//     data: {
//       id: '140edf1b-0a59-4f70-abbc-052462faa010',
//       name: 'MK 2000',
//       siretNumber: '50339868700015',
//       erpId: '1999072765',
//       bankServicesProviderId: '',
//       signatory: {
//         title: 'M',
//         firstName: 'maroo',
//         lastName: 'elleuch',
//         address: {
//           street: 'street',
//           complements: 'complement',
//           zipCode: 'zipcode',
//           city: 'city',
//           country: 'contry'
//         }
//       }
//     }
//   }))
//   const validateIban = vi.fn(() => ({
//     valid: true
//   }))
//   const getBankDetail = vi.fn(() => ({
//     code: '123451234512344567891210',
//     name: 'Banque postale',
//     jeDeclare: {
//       isPartner: true,
//       isScrapable: true
//     }
//   }))
//   return { createMandate, validateIban, getBankDetail }
// })

function mockMandateService(
  createMandateData: any,
  validateIbanData: any,
  getBankDetailData: any) {
  return {
    createMandate: vi.fn(() => createMandateData),
    validateIban: vi.fn(() => validateIbanData),
    getBankDetail: vi.fn(() => getBankDetailData)
  }
}

const createWrapper = (props: any = {}) =>
  wrapperFactory(CreateMandateForm, { props })

describe('form.vue', () => {
  it('renders the component when step value is 1', async () => {
    vi.mock('@/services/mandate', () => {
      return mockMandateService(
        {
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
        },
        {
          valid: true
        },
        {
          code: '123451234512344567891210',
          name: 'Banque postale',
          jeDeclare: {
            isPartner: true,
            isScrapable: true
          }
        }
      )
    })

    const wrapper = createWrapper({ step: 1 })
    await waitForAsyncImports(10)
    expect(wrapper.exists()).toBeTruthy()
  })

  const step1TestCases = [
    {
      initial: {
        ibs: '1234567891',
        name: 'Mike',
        siretNumber: '123456789'
      },
      updated: {
        ibs: '1234567894',
        name: 'MK 2000',
        siretNumber: '50339868700015'
      }
    },
    {
      initial: {
        ibs: '1234567891',
        name: 'Mike',
        siretNumber: '123456789'
      },
      updated: {
        ibs: '1234567898',
        name: 'MK 2000',
        siretNumber: '50339868700015'
      }
    }
  ]

  it.each(step1TestCases)('renders the component when step value is 1', async (step1TestCase) => {
    vi.mock('@/services/mandate', () => {
      return mockMandateService(
        {
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
        },
        {
          valid: true
        },
        {
          code: '123451234512344567891210',
          name: 'Banque postale',
          jeDeclare: {
            isPartner: true,
            isScrapable: false
          }
        }
      )
    })
    const wrapper = createWrapper({ step: 1 })
    Object.assign(wrapper.vm.createMandateForm, step1TestCase.initial)

    await waitForAsyncImports(150)
    await dynamicUntilFoundComponent(wrapper, PForm)
    await dynamicUntilFoundComponent(wrapper, PFormItem)
    await dynamicUntilFoundComponent(wrapper, PInput)
    await dynamicUntilFoundComponent(wrapper, PCol)
    await dynamicUntilFoundComponent(wrapper, PRow)

    // const ibsInputElement = wrapper
    //   .find('[data-testid="ibs-input-test"]')
    // await ibsInputElement
    //   .setValue(step1TestCase.updated.ibs)
    // await ibsInputElement.trigger('change')

    const nameInputElement = wrapper
      .find('[data-testid="name-input-test"]')
    await nameInputElement
      .setValue(step1TestCase.updated.name)

    const siretNumberInputElement = wrapper
      .find('[data-testid="siretNumber-input-test"]')
    await siretNumberInputElement
      .setValue(step1TestCase.updated.siretNumber)

    await waitForAsyncImports(150)
    await dynamicUntilFoundComponent(wrapper, PForm)
    await dynamicUntilFoundComponent(wrapper, PFormItem)
    await dynamicUntilFoundComponent(wrapper, PInput)
    await dynamicUntilFoundComponent(wrapper, PCol)
    await dynamicUntilFoundComponent(wrapper, PRow)

    // expect(wrapper.vm.createMandateForm.ibs)
    //   .toStrictEqual(step1TestCase.updated.ibs)
    expect(wrapper.vm.createMandateForm.name)
      .toStrictEqual(step1TestCase.updated.name)
    expect(wrapper.vm.createMandateForm.siretNumber)
      .toStrictEqual(step1TestCase.updated.siretNumber)
  })

  it('emits the loading event form', async () => {
    vi.mock('@/services/mandate', () => {
      return mockMandateService(
        {
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
        },
        {
          valid: true
        },
        {
          code: '123451234512344567891210',
          name: 'Banque postale',
          jeDeclare: {
            isPartner: true,
            isScrapable: false
          }
        }
      )
    })
    const wrapper = createWrapper({ step: 1 })
    await waitForAsyncImports(50)
    const input = wrapper.find('input[data-testid="ibs-number-test"]')
    await input.setValue('1234567891')
    expect((input.element as HTMLInputElement).value).toBe('1234567891')
    const emittedEnableDisableEvent: any = wrapper.emitted('enable-disable-next')
    expect(emittedEnableDisableEvent).toBeTruthy()
    // expect(createMandate).toHaveBeenCalled()
  })

  it('renders the component when step value is 2', async () => {
    vi.mock('@/services/mandate', () => {
      return mockMandateService(
        {
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
        },
        {
          valid: true
        },
        {
          code: '123451234512344567891210',
          name: 'Banque postale',
          jeDeclare: {
            isPartner: true,
            isScrapable: false
          }
        }
      )
    })
    const wrapper = createWrapper({ step: 2 })
    expect(wrapper.exists()).toBeTruthy()
  })

  it('validateIBS when ibs length is equal to 10', async () => {
    vi.mock('@/services/mandate', () => {
      return mockMandateService(
        {
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
        },
        {
          valid: true
        },
        {
          code: '123451234512344567891210',
          name: 'Banque postale',
          jeDeclare: {
            isPartner: true,
            isScrapable: false
          }
        }
      )
    })
    const wrapper = createWrapper({ step: 1 })
    await waitForAsyncImports(60)
    wrapper.vm.validateIBS = vi.fn()
    const input = wrapper.find('input[data-testid="ibs-number-test"]')
    await input.setValue('1234567891')
    await input.trigger('change')

    expect((input.element as HTMLInputElement).value).toBe('1234567891')
  })

  it('validateIBS when ibs length is not equal to 10', async () => {
    vi.mock('@/services/mandate', () => {
      return mockMandateService(
        {
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
        },
        {
          valid: true
        },
        {
          code: '123451234512344567891210',
          name: 'Banque postale',
          jeDeclare: {
            isPartner: true,
            isScrapable: false
          }
        }
      )
    })
    const wrapper = createWrapper({ step: 1 })
    await waitForAsyncImports(50)
    wrapper.vm.validateIBS = vi.fn()
    const input = wrapper.find('input[data-testid="ibs-number-test"]')
    await input.setValue('123456789')
    await input.trigger('change')

    expect((input.element as HTMLInputElement).value).toBe('123456789')
  })

  it('checkAndEmitEvents when fields are not filled', async () => {
    vi.mock('@/services/mandate', () => {
      return mockMandateService(
        {
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
        },
        {
          valid: true
        },
        {
          code: '123451234512344567891210',
          name: 'Banque postale',
          jeDeclare: {
            isPartner: true,
            isScrapable: false
          }
        }
      )
    })
    const wrapper = createWrapper({ step: 2 })
    await waitForAsyncImports(150)
    const input = wrapper.find('input[data-testid="firstName-test"]')
    await input.setValue('')
    await input.trigger('blur')

    wrapper.vm.checkAndEmitEvents()
    expect(wrapper.emitted()['enable-disable-next']).toBeTruthy()
  })

  const step3TestCases = [
    {
      initial: {
        institutionCode: '12345',
        branchCode: '12345',
        accountNumber: '12345678910',
        key: '12'
      },
      updated: {
        institutionCode: '54321',
        branchCode: '54321',
        accountNumber: '01987654321',
        key: '21',
        valid: true
      }
    },
    {
      initial: {
        institutionCode: '12345',
        branchCode: '12345',
        accountNumber: '12345678910',
        key: '12'
      },
      updated: {
        institutionCode: '5432',
        branchCode: '5432',
        accountNumber: '0198765432',
        key: '2',
        valid: false
      }
    },
    {
      initial: {
        institutionCode: '12345',
        branchCode: '12345',
        accountNumber: '12345678910',
        key: '12'
      },
      updated: {
        institutionCode: '5432s',
        branchCode: '5432s',
        accountNumber: '019876543,',
        key: '2s',
        valid: false
      }
    }
  ]

  it.each(step3TestCases)('renders the component when step value is 3 (valid rib)',
    async (step3TestCase) => {
      vi.mock('@/services/mandate', () => {
        return mockMandateService(
          {
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
          },
          {
            valid: true
          },
          {
            code: '123451234512344567891210',
            name: 'Banque postale',
            jeDeclare: {
              isPartner: true,
              isScrapable: false
            }
          }
        )
      })
      const wrapper = createWrapper({ step: 3 })
      Object.assign(wrapper.vm.createMandateForm, step3TestCase.initial)

      await dynamicUntilFoundComponent(wrapper, PForm)
      await dynamicUntilFoundComponent(wrapper, PFormItem)
      await dynamicUntilFoundComponent(wrapper, PInput)
      await dynamicUntilFoundComponent(wrapper, PCol)
      await dynamicUntilFoundComponent(wrapper, PRow)

      const institutionCodeInputElement = wrapper
        .find('[data-testid="institutionCode-input-test"]')
      await institutionCodeInputElement
        .setValue(step3TestCase.updated.institutionCode)
      await institutionCodeInputElement.trigger('blur')

      const branchCodeInputElement = wrapper
        .find('[data-testid="branchCode-input-test"]')
      await branchCodeInputElement
        .setValue(step3TestCase.updated.branchCode)
      await branchCodeInputElement.trigger('blur')

      const accountNumberInputElement = wrapper
        .find('[data-testid="accountNumber-input-test"]')
      await accountNumberInputElement
        .setValue(step3TestCase.updated.accountNumber)
      await accountNumberInputElement.trigger('blur')

      const keyInputElement = wrapper
        .find('[data-testid="key-input-test"]')
      await keyInputElement
        .setValue(step3TestCase.updated.key)
      await keyInputElement.trigger('blur')

      expect(wrapper.vm.createMandateForm.institutionCode)
        .toStrictEqual(step3TestCase.updated.institutionCode)
      expect(wrapper.vm.createMandateForm.branchCode)
        .toStrictEqual(step3TestCase.updated.branchCode)
      expect(wrapper.vm.createMandateForm.accountNumber)
        .toStrictEqual(step3TestCase.updated.accountNumber)
      expect(wrapper.vm.createMandateForm.key)
        .toStrictEqual(step3TestCase.updated.key)
    })

  it.each(step3TestCases)('renders the component when step value is 3 (unvalid rib)',
    async (step3TestCase) => {
      vi.mock('@/services/mandate', () => {
        return mockMandateService(
          {
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
          },
          {
            valid: false
          },
          {
            code: '123451234512344567891210',
            name: 'Banque postale',
            jeDeclare: {
              isPartner: true,
              isScrapable: false
            }
          }
        )
      })
      const wrapper = createWrapper({ step: 3 })
      Object.assign(wrapper.vm.createMandateForm, step3TestCase.initial)

      await dynamicUntilFoundComponent(wrapper, PForm)
      await dynamicUntilFoundComponent(wrapper, PFormItem)
      await dynamicUntilFoundComponent(wrapper, PInput)
      await dynamicUntilFoundComponent(wrapper, PCol)
      await dynamicUntilFoundComponent(wrapper, PRow)

      const institutionCodeInputElement = wrapper
        .find('[data-testid="institutionCode-input-test"]')
      await institutionCodeInputElement
        .setValue(step3TestCase.updated.institutionCode)
      await institutionCodeInputElement.trigger('blur')

      const branchCodeInputElement = wrapper
        .find('[data-testid="branchCode-input-test"]')
      await branchCodeInputElement
        .setValue(step3TestCase.updated.branchCode)
      await branchCodeInputElement.trigger('blur')

      const accountNumberInputElement = wrapper
        .find('[data-testid="accountNumber-input-test"]')
      await accountNumberInputElement
        .setValue(step3TestCase.updated.accountNumber)
      await accountNumberInputElement.trigger('blur')

      const keyInputElement = wrapper
        .find('[data-testid="key-input-test"]')
      await keyInputElement
        .setValue(step3TestCase.updated.key)
      await keyInputElement.trigger('blur')

      expect(wrapper.vm.createMandateForm.institutionCode)
        .toStrictEqual(step3TestCase.updated.institutionCode)
      expect(wrapper.vm.createMandateForm.branchCode)
        .toStrictEqual(step3TestCase.updated.branchCode)
      expect(wrapper.vm.createMandateForm.accountNumber)
        .toStrictEqual(step3TestCase.updated.accountNumber)
      expect(wrapper.vm.createMandateForm.key)
        .toStrictEqual(step3TestCase.updated.key)
    })
})
