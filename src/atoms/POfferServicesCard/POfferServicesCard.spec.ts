import { describe, it, expect, beforeEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import type { POfferServicesCardProps } from './POfferServicesCardTypes'
import POfferServicesCard from '.'

let wrapper: VueWrapper<any>
const offerTitle: string = 'Pulse platform services'

const defaultProps: POfferServicesCardProps = {
  pLogo: 'iconpulse-color',
  pTitle: offerTitle,
  pServices: [
    {
      pStatus: true,
      pDisabled: false,
      pName: 'GED Accounting',
      pTag: {
        pContent: 'Included',
        pColor: 'gray-900',
        pEffect: 'light',
      },
    },
    {
      pStatus: true,
      pDisabled: true,
      pName: 'Cash register module',
    },
  ],
}

const createWrapper = (props: POfferServicesCardProps = defaultProps) =>
  mount(POfferServicesCard, {
    props,
  })

describe('pOfferServicesCard', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('should render the title and services of an offer', () => {
    expect(
      wrapper
        .find('.p-offer-services-card__offer .p-offer-services-card__title')
        .text(),
    ).toContain(offerTitle)
    expect(wrapper.find('.p-offer-services-card__services')).toBeTruthy()
  })

  it('should display all services of an offer', () => {
    const servicesCount = wrapper.findAll(
      '.p-offer-services-card__service',
    ).length

    expect(servicesCount).toBe(2)
  })

  it('every service should have a switch', () => {
    const services = wrapper.findAll('.p-offer-services-card__service')
    const servicesName = defaultProps.pServices.map((service) => service.pName)

    services.forEach((service, serviceIndex) => {
      expect(
        service.find('.p-offer-services-card__service-switch'),
      ).toBeTruthy()
      expect(service.find('.p-offer-services-card__service-name').text()).toBe(
        servicesName[serviceIndex],
      )
    })
  })

  it('should emit event changeServiceStatus after switching status of service', async () => {
    const service = wrapper.find('.p-offer-services-card__service')
    service.find('.p-offer-services-card__service-switch').trigger('click')
    await nextTick()

    expect(wrapper.emitted()).toHaveProperty('changeServiceStatus')
  })
})
