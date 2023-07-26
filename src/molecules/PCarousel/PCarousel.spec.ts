import wrapperFactory from '@tests/utils/wrapperFactory'
import PCarousel from '.'
import { describe, it, expect } from 'vitest'
import { VueWrapper } from '@vue/test-utils'

const createWrapper = (props: any = {}) =>
  wrapperFactory(PCarousel, {
    props
  })

describe('PCarousel', () => {
  // Define a sample data for testing
  const items = [
    {
      text: 'this is a test',
      imageName: 'digitalisation',
      imageType: 'paupulse'
    },
    {
      text: 'this is a second test',
      imageType: 'paupulse',
      imageName: 'mandat-bancaire'
    }
  ]

  it('should display the carousel component', () => {
    const wrapper: VueWrapper<any> = createWrapper({ items })
    const carouselElement = wrapper.find('el-carousel')
    const carouselItem = wrapper.findAll('p-carousel-item-stub')
    expect(carouselElement.exists()).toBeTruthy()
    expect(carouselItem).toHaveLength(2)
  })
})
