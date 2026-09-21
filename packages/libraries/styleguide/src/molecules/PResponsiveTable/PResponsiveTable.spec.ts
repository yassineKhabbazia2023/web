import { shallowMount } from '@vue/test-utils'
import { ref } from 'vue'
import PResponsiveTable from './'
import PTable from '../../atoms/PTable'
import PResponsiveTableCard from '../../atoms/PResponsiveTableCard'

import { useResponsive } from '../../composables/use-responsive.composable'

const mockData = [
  { id: 1, name: 'Entity 1', code: '001' },
  { id: 2, name: 'Entity 2', code: '002' },
]

function createWrapper(props = {}, isDesktop = true) {
  vi.mocked(useResponsive).mockReturnValue({
    isDesktop: ref(isDesktop),
    isMobile: ref(!isDesktop),
    width: ref(isDesktop ? 1024 : 500),
    currentBreakpoint: ref(isDesktop ? 'md' : 'xs'),
  } as any)

  return shallowMount(PResponsiveTable, {
    props: {
      pData: mockData,
      ...props,
    },
    global: {
      stubs: {
        PTable: {
          name: 'PTable',
          template: '<div class="p-table-stub"><slot /></div>',
          props: ['pData', 'pStripe', 'pFit', 'pHeaderCellStyle', 'pCellStyle'],
        },
        PResponsiveTableCard: {
          name: 'PResponsiveTableCard',
          template: '<div class="p-card-stub"><slot name="title" /><slot name="actions" /><slot name="body" /></div>',
          props: ['pRow', 'pClickable', 'pStriped', 'pSelected'],
        },
      },
    },
  })
}

describe('PResponsiveTable', () => {
  describe('desktop view', () => {
    it('renders PTable on desktop', () => {
      const wrapper = createWrapper({}, true)

      expect(wrapper.findComponent(PTable).exists()).toBe(true)
      expect(wrapper.findAllComponents(PResponsiveTableCard).length).toBe(0)
    })

    it('passes pData to PTable', () => {
      const wrapper = createWrapper({}, true)

      const table = wrapper.findComponent(PTable)
      expect(table.props('pData')).toEqual(mockData)
    })

    it('passes pStripe to PTable', () => {
      const wrapper = createWrapper({ pStripe: true }, true)

      const table = wrapper.findComponent(PTable)
      expect(table.props('pStripe')).toBe(true)
    })

    it('passes pFit to PTable', () => {
      const wrapper = createWrapper({ pFit: false }, true)

      const table = wrapper.findComponent(PTable)
      expect(table.props('pFit')).toBe(false)
    })
  })

  describe('mobile view', () => {
    it('renders PResponsiveTableCard for each row on mobile', () => {
      const wrapper = createWrapper({}, false)

      // PTable is always rendered but hidden on mobile
      expect(wrapper.findComponent(PTable).exists()).toBe(true)
      expect(wrapper.findAllComponents(PResponsiveTableCard).length).toBe(mockData.length)
    })

    it('passes row data to each card', () => {
      const wrapper = createWrapper({}, false)

      const cards = wrapper.findAllComponents(PResponsiveTableCard)
      expect(cards[0].props('pRow')).toEqual(mockData[0])
      expect(cards[1].props('pRow')).toEqual(mockData[1])
    })

    it('passes pCardClickable to cards', () => {
      const wrapper = createWrapper({ pCardClickable: true }, false)

      const cards = wrapper.findAllComponents(PResponsiveTableCard)
      expect(cards[0].props('pClickable')).toBe(true)
    })

    it('uses pRowKey as the key when provided', () => {
      const wrapper = createWrapper({ pRowKey: 'id' }, false)

      const cards = wrapper.findAllComponents(PResponsiveTableCard)
      expect(cards.length).toBe(mockData.length)
      expect(cards[0].props('pRow')).toEqual(mockData[0])
    })
  })

  describe('events', () => {
    it('emits row-click when card is clicked on mobile', async () => {
      const wrapper = createWrapper({ pCardClickable: true }, false)

      const firstCard = wrapper.findAllComponents(PResponsiveTableCard)[0]
      await firstCard.vm.$emit('click', mockData[0])

      expect(wrapper.emitted('row-click')).toBeTruthy()
      expect(wrapper.emitted('row-click')?.[0]).toEqual([mockData[0]])
    })

    it('emits card-click when card is clicked on mobile', async () => {
      const wrapper = createWrapper({ pCardClickable: true }, false)

      const firstCard = wrapper.findAllComponents(PResponsiveTableCard)[0]
      await firstCard.vm.$emit('click', mockData[0])

      expect(wrapper.emitted('card-click')).toBeTruthy()
      expect(wrapper.emitted('card-click')?.[0]).toEqual([mockData[0]])
    })
  })

  describe('mobile slots', () => {
    it('renders mobile-title slot for each card', () => {
      const wrapper = createWrapper({}, false)

      const cards = wrapper.findAllComponents(PResponsiveTableCard)
      expect(cards.length).toBe(mockData.length)
      // Slots are passed through to cards
      expect(cards[0].find('.p-card-stub').exists()).toBe(true)
    })

    it('renders mobile-actions slot for each card', () => {
      const wrapper = createWrapper({}, false)

      const cards = wrapper.findAllComponents(PResponsiveTableCard)
      expect(cards.length).toBe(mockData.length)
    })
  })

  describe('card props', () => {
    it('passes pStriped based on index when pStripe is true', () => {
      const wrapper = createWrapper({ pStripe: true }, false)

      const cards = wrapper.findAllComponents(PResponsiveTableCard)
      expect(cards[0].props('pStriped')).toBe(false) // index 0: even
      expect(cards[1].props('pStriped')).toBe(true)  // index 1: odd
    })

    it('does not pass pStriped when pStripe is false', () => {
      const wrapper = createWrapper({ pStripe: false }, false)

      const cards = wrapper.findAllComponents(PResponsiveTableCard)
      expect(cards[0].props('pStriped')).toBe(false)
      expect(cards[1].props('pStriped')).toBe(false)
    })

    it('passes pSelected based on pIsRowSelected function', () => {
      const isRowSelected = (row: Record<string, any>) => row.id === 1

      const wrapper = createWrapper({ pIsRowSelected: isRowSelected }, false)

      const cards = wrapper.findAllComponents(PResponsiveTableCard)
      expect(cards[0].props('pSelected')).toBe(true)  // id: 1
      expect(cards[1].props('pSelected')).toBe(false) // id: 2
    })

    it('passes pSelected as false when pIsRowSelected is not provided', () => {
      const wrapper = createWrapper({}, false)

      const cards = wrapper.findAllComponents(PResponsiveTableCard)
      expect(cards[0].props('pSelected')).toBe(false)
      expect(cards[1].props('pSelected')).toBe(false)
    })
  })
})
