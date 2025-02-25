import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import DocumentsList from './DocumentsList.vue'
import type { VueWrapper } from '@vue/test-utils'
import { mount, shallowMount } from '@vue/test-utils'
import type { DocumentsListProps } from './documents-list.types'
import { documentsResponsePayload } from '../../mocks/documentsWithTableStructureDataMock'
import { PTableColumn, PTable, PToolbox } from '@pulse/styleguide/components'
import type { ComponentPublicInstance } from 'vue'
import { nextTick } from 'vue'
import type { Document } from '@ged/models/Document'
import TableElement from './components/TableElement'

type DocumentsListSetup = {
  selectedDocuments: Document[]
}

const defaultProps: DocumentsListProps = {
  documentsListWithTableStructure: documentsResponsePayload,
  currentService: '1000',
}

const payloadWithZeroItems = {
  ...documentsResponsePayload,
  items: [
  ],
  totalItems: 39,
  endIndex: 4,
  startIndex: 1,
}

export type DocumentsListWrapper = VueWrapper<
  ComponentPublicInstance<DocumentsListSetup, DocumentsListProps>
>
const createWrapper = (props: DocumentsListProps = defaultProps): DocumentsListWrapper => {
  return shallowMount(DocumentsList, {
    props,
    global: {
      stubs: {
        PTable,
        PTableColumn,
        TableElement,
        PToolbox: {
          template: '<span />',
        },
      },
      plugins: [pinia],
    },
  }) as unknown as DocumentsListWrapper
}

const pinia = createPinia()

describe('documentList', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })

  describe('props', () => {
    it('should render columns based on provided documentHeaders', async () => {
      const wrapper: DocumentsListWrapper = mount(DocumentsList, {
        props: defaultProps,
        global: {
          stubs: {
            PToolbox: {
              template: '<span />',
            },
          },
          plugins: [pinia],
        },
      }) as unknown as DocumentsListWrapper

      wrapper.find('.el-table__cell')
      await nextTick()

      const columns = wrapper.findAllComponents({ name: 'PTableColumn' })
      await nextTick()
      expect(columns).toHaveLength(7)
    }, 30000)
  })
  describe('events', () => {
    it('should emit on-sort-change when sort-change', async () => {
      const emitPayload =

        '{"column":{"order":"ascending","id":"el-table_2_column_11","type":"default","align":null,"headerAlign":null,"showOverflowTooltip":false,"filteredValue":[],"filterPlacement":"","isColumnGroup":false,"isSubColumn":false,"filterOpened":false,"sortable":true,"rawColumnKey":0,"label":"Nom du document","fixed":false,"resizable":true,"sortOrders":["ascending","descending",null],"reserveSelection":false,"filterMultiple":true,"width":591,"minWidth":80,"realWidth":591,"no":2,"level":1,"colSpan":1,"rowSpan":1},"order":"ascending"}'

      const wrapper = createWrapper()

      wrapper.find('.el-table__cell')
      await nextTick()

      const table = wrapper.findComponent({ name: 'PTable' })
      await nextTick()
      table.vm.$emit('sort-change', JSON.parse(emitPayload))
      await nextTick()

      expect(wrapper.emitted('on-sort-change')).toBeTruthy()
      expect(wrapper.emitted('on-sort-change')).toStrictEqual([['+name']])
    }, 30000)

    it('should emit document-selection-change upon ptable selection-change event', async () => {
      const wrapper = createWrapper()
      wrapper.find('.el-table__cell')
      await nextTick()

      const table = wrapper.findComponent({ name: 'PTable' })
      await nextTick()

      table.vm.$emit(
        'selection-change',
        documentsResponsePayload.documentsPage.items,
      )
      await nextTick()

      expect(wrapper.emitted('document-selection-change')).toBeTruthy()
      expect(wrapper.emitted('document-selection-change')).toStrictEqual([
        [documentsResponsePayload.documentsPage.items],
      ])
    }, 30000)

    describe('when emit actions-dropdown-opened', () => {
      let wrapper: DocumentsListWrapper
      beforeEach(async () => {
        wrapper = mount(DocumentsList, {
          props: defaultProps,
          global: {
            stubs: {
              PToolbox: {
                template: '<span />',
              },
            },
            plugins: [pinia],
          },
        }) as unknown as DocumentsListWrapper

        await nextTick()
      })
      it('should select row oppon TableElement actions-dropdown-opened', async () => {
        const tableElements = wrapper.findAllComponents(TableElement)
        tableElements[0].vm.$emit('actions-dropdown-opened',
          documentsResponsePayload.documentsPage.items[0],
          { label: 'Actions' },
        )
        await nextTick()
        const componentInstance = wrapper.vm
        expect(
          componentInstance.selectedDocuments,
        ).toStrictEqual(documentsResponsePayload.documentsPage.items)
      })
      it('should select and open preview drawer', async () => {
        const tableElements = wrapper.findAllComponents(TableElement)
        tableElements[0].vm.$emit('actions-dropdown-opened',
          documentsResponsePayload.documentsPage.items[0],
          { label: 'Statut' },
        )
        await nextTick()
        const componentInstance = wrapper.vm
        expect(wrapper.emitted('table-row-clicked')).toBeTruthy()
        expect(wrapper.emitted('table-row-clicked')).toStrictEqual([
          [documentsResponsePayload.documentsPage.items[0]],
        ])

        // we don't select the row if preview
        expect(
          componentInstance.selectedDocuments,
        ).toStrictEqual([])
      })
    })
    it('should propagate toolbox-action-triggered of tableElement', async () => {
      const wrapper: DocumentsListWrapper = mount(DocumentsList, {
        props: defaultProps,
        global: {
          stubs: {
            PToolbox: {
              template: '<span />',
            },
          },
          plugins: [pinia],
        },
      }) as unknown as DocumentsListWrapper

      await nextTick()

      wrapper.find('.el-table__cell')
      await nextTick()

      const tableElements = wrapper.findAllComponents(TableElement)

      tableElements[0].vm.$emit('toolbox-action-triggered')

      await nextTick()

      expect(wrapper.emitted('toolbox-action-triggered')).toBeTruthy()
    })

    it('should display the correct text when not data available in the documentsList', async () => {
      const wrapper = createWrapper({
        ...defaultProps,
        documentsListWithTableStructure: payloadWithZeroItems,
      })

      const table = wrapper.findComponent({ name: 'PTable' })
      const elTableStubEmptyTextValue = table.find('el-table-stub').attributes('emptytext')
      await nextTick()

      expect(elTableStubEmptyTextValue).toBe('Aucun résultat')
    })

    describe('DocumentsList - Right-click a row should open toolbox', () => {
      it('should trigger toolbox action when right-clicking on a row', async () => {
        const wrapper = createWrapper()
        const table = wrapper.findComponent({ name: 'PTable' })
        const mockedRow = { permissions: [] }
        const mockedEvent = { preventDefault: vi.fn(), clientX: 100, clientY: 100 }

        table.vm.$emit('row-contextmenu', mockedRow, null, mockedEvent)
        await wrapper.vm.$nextTick()

        expect(mockedEvent.preventDefault).toHaveBeenCalled()
        expect(wrapper.findComponent(PToolbox).exists()).toBe(true)
      })

      it('should correctly set toolbox style on right-click', async () => {
        const wrapper = createWrapper()
        const table = wrapper.findComponent({ name: 'PTable' })
        const mockedRow = { permissions: [] }
        const mockedEvent = { preventDefault: vi.fn(), clientX: 100, clientY: 100 }

        vi.spyOn(document, 'querySelector').mockReturnValue({
          getBoundingClientRect: () => ({
            left: 50,
            top: 50,
            width: 500,
            height: 300,
          }),
        } as HTMLElement)

        table.vm.$emit('row-contextmenu', mockedRow, null, mockedEvent)
        await wrapper.vm.$nextTick()
        await new Promise(resolve => setTimeout(resolve, 50))

        expect((wrapper.vm as any).toolboxCoordinates.x).toBeGreaterThanOrEqual(10)
        expect((wrapper.vm as any).toolboxCoordinates.y).toBeGreaterThanOrEqual(100)
      })
    })
  })
})