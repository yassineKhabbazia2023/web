import wrapperFactory from '../../tests/utils/wrapperFactory'
import { flushPromises } from '@vue/test-utils'
import PBreadcrumb from '../../molecules/PBreadcrumb'
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { type PBreadcrumbProps, type BreadcrumbItems } from './PBreadcrumbTypes'

const defaultBreadCumb = [
  {
    pId: 0,
    pText: 'Hello item',
  },
  {
    pId: 1,
    pText: 'Hello item',
  },

  {
    pId: 2,
    pText: 'Hello item',
  },
] as BreadcrumbItems[]

const defaultProps: PBreadcrumbProps = {
  pElements: defaultBreadCumb,
}

const createWrapper = (props = defaultProps) => {
  return wrapperFactory(PBreadcrumb, {
    props,
    global: {
      stubs: {
        ElBreadcrumb,
        ElBreadcrumbItem,
        PTooltip: {
          template: `
            <div
              class="p-tooltip-stub"
              :disabled="disabled"
              :p-content="pContent"
              :p-placement="pPlacement"
            >
              <slot />
            </div>
          `,
          props: ['disabled', 'pContent', 'pPlacement'],
        },
      },
    },
  })
}

const generateBreadCrumbItems = (numberOfItems: number) => {
  const breadcrumbItems = [] as BreadcrumbItems[]
  for (let i = 0; i < numberOfItems; i++) {
    breadcrumbItems.push({ pId: i, pText: `Lorem ${i}` })
  }
  return breadcrumbItems
}

describe('pBreadcrumb', () => {
  describe('props', () => {
    it('should display only 7 items (6 items + ellipes separator)if number of element > 6', () => {
      const wrapper = createWrapper({
        pElements: generateBreadCrumbItems(10),
      })

      expect(wrapper.findAll('.el-breadcrumb__item')).toHaveLength(7)
    })
    it('should disbale tooltip if the the item has -1 as id', () => {
      const wrapper = createWrapper({
        pElements: generateBreadCrumbItems(10),
      })

      const sampleItem = wrapper.find('.p-tooltip-stub[disabled="true"]')
      expect(sampleItem.attributes('disabled')).toBe('true')
    })

    it('should render the ellipsis as an icon trigger', () => {
      const wrapper = createWrapper({
        pElements: generateBreadCrumbItems(10),
      })

      const ellipsisTrigger = wrapper.find('[data-testid="breadcrumb-ellipsis-trigger"]')
      const ellipsisIcon = ellipsisTrigger.find('p-icon-stub[pname="threeDots"]')

      expect(ellipsisTrigger.exists()).toBeTruthy()
      expect(wrapper.text()).not.toContain('...')
      expect(ellipsisIcon.exists()).toBeTruthy()
    })

    it('should mark the last breadcrumb item as current', () => {
      const wrapper = createWrapper()

      const lastItemText = wrapper.findAll('[data-testid="breadcrumb-item-text"]').at(-1)

      expect(lastItemText?.classes()).toContain('p-breadcrumb__text--current')
    })

    it('should render a regular text item when pId is -1 and the item is not an ellipsis', () => {
      const wrapper = createWrapper({
        pElements: [
          { pId: -1, pText: 'Documents' },
          { pId: 10, pText: 'Comptabilite' },
          { pId: 11, pText: 'Depot' },
        ],
      })

      expect(wrapper.find('[data-testid="breadcrumb-ellipsis-trigger"]').exists()).toBeFalsy()
      expect(wrapper.text()).toContain('Documents')
    })
  })
  describe('events', () => {
    it('should emit p-breadcrumb-item-click on breadcrumb item click', async () => {
      const wrapper = createWrapper()
      const item = wrapper.findAll('.el-breadcrumb__item')[0]
      await item.trigger('click')
      await flushPromises()
      expect(wrapper.emitted('p-breadcrumb-item-click')).toHaveLength(1)
      expect(wrapper.emitted('p-breadcrumb-item-click')).toStrictEqual([
        [defaultBreadCumb[0].pId],
      ])
    })
  })
})
