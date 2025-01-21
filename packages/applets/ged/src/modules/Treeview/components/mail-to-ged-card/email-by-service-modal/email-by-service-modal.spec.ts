import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { mailToGedServicesLines } from '@ged/modules/Treeview/mocks/mail-to-ged.mock'
import EmailByServiceModal from '.'


describe('email by service modal', () => {
  it('renders the component', () => {
    const wrapper = shallowMount(EmailByServiceModal, {
      props: {
        modelValue: true,
        mailToGedInformation: mailToGedServicesLines,
      },
    })
    expect(wrapper.exists()).toBeTruthy()
  })
})
