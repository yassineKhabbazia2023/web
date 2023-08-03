import { describe, it, expect } from 'vitest'
import wrapperFactory from 'tests/utils/wrapperFactory'
import PBreadcrumb from '@/molecules/PBreadcrumb'
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { type PBreadcrumbProps, type BreadcrumbItems } from './PBreadcrumbTypes'

const defaultBreadCumb = [
  {
    id: '0',
    text: 'Hello item'
  },
  {
    id: '0',
    text: 'Hello item'
  },

  {
    id: '0',
    text: 'Hello item'
  }
] as unknown as BreadcrumbItems[]

const defaultProps: PBreadcrumbProps = {
  elements: defaultBreadCumb
}

const createWrapper = (props = defaultProps) => {
  return wrapperFactory(PBreadcrumb, {
    props,
    global: {
      stubs: {
        ElBreadcrumb,
        ElBreadcrumbItem
      }
    }
  })
}

const generateBreadCrumbItems = (numberOfItems: number) => {
  const breadcrumbItems = [] as unknown as BreadcrumbItems[]
  for (let i = 0; i < numberOfItems; i++) {
    breadcrumbItems.push({ id: i.toString(), text: `Lorem ${i}` } as never)
  }
  return breadcrumbItems
}

describe('pBreadcrumb', () => {
  describe('props', () => {
    it('should display only 7 items (6 items + ellipes separator)if number of element > 6', () => {
      const wrapper = createWrapper({
        elements: generateBreadCrumbItems(10)
      })

      expect(wrapper.findAll('.el-breadcrumb__item')).toHaveLength(7)
    })
    it('should disbale tooltip if the the item has -1 as id', () => {
      const wrapper = createWrapper({
        elements: generateBreadCrumbItems(10)
      })

      const sampleItem = wrapper.find('p-tooltip-stub[disabled="true"]')
      expect(sampleItem.attributes('disabled')).toStrictEqual('true')
    })
  })
  describe('events', () => {
    it('should emit p-breadcrumb-item-click on breadcrumb item click', async () => {
      const wrapper = createWrapper()
      const item = wrapper.findAll('.el-breadcrumb__item')[0]
      await item.trigger('click')

      expect(wrapper.emitted('p-breadcrumb-item-click')).toHaveLength(1)
      expect(wrapper.emitted('p-breadcrumb-item-click')).toStrictEqual([
        [defaultBreadCumb[0].id]
      ])
    })
  })
})
