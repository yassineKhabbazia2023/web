import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { mailToGedServicesLines } from '@ged/modules/Treeview/mocks/mail-to-ged.mock'
import EmailByServiceModal from '.'

function createWrapper(isOpened = true, mailToGedInformation = mailToGedServicesLines) {
  const props = {
    isOpened,
    mailToGedInformation,
  }

  return mount(EmailByServiceModal, {
    props,
  })
}

describe('email by service modal', () => {
  it('renders the component', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBeTruthy()
  })

  it.each([
    {
      testName: 'should render services information lines when isOpened is true',
      isOpened: true,
      shouldInformationLineBeVisible: true,
    },
    {
      testName: 'should NOT render services information lines when isOpened is false',
      isOpened: false,
      shouldInformationLineBeVisible: false,
    },
  ])('$testName', async ({ isOpened, shouldInformationLineBeVisible }) => {
    const wrapper = createWrapper(isOpened)
    await flushPromises()

    const serviceEmailInformationLineWrapper = wrapper.findComponent({ name: 'ServiceEmailInformationLine' })
    expect(serviceEmailInformationLineWrapper.exists()).toBe(shouldInformationLineBeVisible)
  })
})
