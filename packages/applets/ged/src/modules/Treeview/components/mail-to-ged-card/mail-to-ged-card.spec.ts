import { flushPromises, shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import MailToGedCard from '.'
import { fetchServicesMailToGedInformation } from '@ged/services/Services'

vi.mock('@ged/services/Services')

const entity = '12345'
const accountId = 1234
const defaultProps = {
  selectedEntity: entity,
  accountId,
}

const createWrapper = (props: any = defaultProps) =>
  shallowMount(MailToGedCard, {
    props,
  })

describe('mail to ged card', () => {
  describe('api', () => {
    it('should fetch the mail to ged information when component is mounted', async () => {
      createWrapper()
      await flushPromises()

      expect(fetchServicesMailToGedInformation).toHaveBeenCalledWith()
    })
  })
})
