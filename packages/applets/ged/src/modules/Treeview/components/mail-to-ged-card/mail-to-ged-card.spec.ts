import { flushPromises, shallowMount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import MailToGedCard from '.'
import { fetchServicesMailToGedInformation } from '@ged/services/Services'
import { servicesData } from '@ged/modules/Treeview/mocks/servicesDataMock'
import { mailToGedServicesLines } from '@ged/modules/Treeview/mocks/mail-to-ged.mock'


vi.mock('@ged/services/Services')

const loggerErrorSpy = vi.hoisted(() => vi.fn())

vi.mock('@pulse/core', () => ({
  logger: {
    error: loggerErrorSpy,
  },
}))

const selectedEntity = '12345'
const accountId = 1234
const defaultProps = {
  selectedEntity,
  accountId,
  entityServices: servicesData,
}

const createWrapper = (props: any = defaultProps) =>
  shallowMount(MailToGedCard, {
    props,
  })

function findMailToGedCardWrapper(wrapper: VueWrapper) {
  return wrapper.find('.mail-to-ged')
}

describe('mail to ged card', () => {
  describe('api', () => {
    it('should fetch the mail to ged information when component is mounted', async () => {
      vi.mocked(fetchServicesMailToGedInformation).mockResolvedValueOnce(mailToGedServicesLines)
      const wrapper = createWrapper()
      await flushPromises()

      const mailToGedCardWrapper = findMailToGedCardWrapper(wrapper)
      expect(fetchServicesMailToGedInformation).toHaveBeenCalledWith(selectedEntity, servicesData, accountId)
      expect(mailToGedCardWrapper.exists()).toBeTruthy()
    })
  })

  it('should not render the card if content is empty', async () => {
    vi.mocked(fetchServicesMailToGedInformation).mockRejectedValueOnce(new Error('Failed to retrieve information'))
    const wrapper = createWrapper()
    await flushPromises()

    const mailToGedCardWrapper = findMailToGedCardWrapper(wrapper)
    expect(mailToGedCardWrapper.exists()).toBeFalsy()
    expect(loggerErrorSpy).toHaveBeenCalledOnce()
  })
})
