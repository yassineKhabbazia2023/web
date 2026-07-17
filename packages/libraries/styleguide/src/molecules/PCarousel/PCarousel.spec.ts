import wrapperFactory from '../../tests/utils/wrapperFactory'
import PCarousel from '.'
import { ElCarousel, ElCarouselItem } from 'element-plus'

import type { VueWrapper } from '@vue/test-utils'
import type { PCarouselProps } from './PCarouselTypes'
import type { PCarouselItemProps } from '../../atoms/PCarouselItem/PCarouselItemTypes'

const createWrapper = (props: PCarouselProps) =>
  wrapperFactory(PCarousel, {
    props,
    global: {
      stubs: {
        ElCarousel,
        ElCarouselItem,
      },
    },
  })

describe('pCarousel', () => {
  // Define a sample data for testing
  const items: PCarouselItemProps[] = [
    {
      pText: 'this is a test',
      pImageName: 'notes',
      pImageType: 'paupulse',
    },
    {
      pText: 'this is a second test',
      pImageType: 'paupulse',
      pImageName: 'onboarding',
    },
  ]

  it('should display the carousel component', () => {
    const wrapper: VueWrapper<any> = createWrapper({ pItems: items })
    const carouselElement = wrapper.find('.el-carousel')
    const carouselItem = wrapper.findAll('p-carousel-item-stub')
    expect(carouselElement.exists()).toBeTruthy()
    expect(carouselItem).toHaveLength(2)
  })
})
