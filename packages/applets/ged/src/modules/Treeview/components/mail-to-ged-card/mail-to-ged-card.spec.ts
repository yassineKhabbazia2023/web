import { flushPromises, shallowMount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { loggerErrorSpy, loggerMock } from '@pulse/core/mocks'
import { servicesDataMock } from '@ged/__mocks__/services.mocks'
import { accountId, selectedEntity } from '@ged/__mocks__/files.mocks'
import { mailToGedServicesLines } from '@ged/__mocks__/mail-to-ged.mocks'
import { fetchServicesMailToGedInformation } from '@ged/services/Services'

import MailToGedCard from '.'

vi.mock('@ged/services/Services')
vi.mock('@pulse/core', () => ({ logger: loggerMock }))

const defaultProps = {
  selectedEntity,
  accountId,
  entityServices: servicesDataMock,
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
      expect(fetchServicesMailToGedInformation).toHaveBeenCalledWith(selectedEntity, servicesDataMock, accountId)
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
