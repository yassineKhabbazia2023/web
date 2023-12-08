import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import DocumentsList from './DocumentsList.vue'
import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import type { DocumentsListProps } from './DocumentsListTypes'
import { documentsResponsePayload } from '../../mocks/documentsWithTableStructureDataMock'
import { PTableColumn, PTable } from '@kpmg/styleguide'
import { ComponentPublicInstance, nextTick } from 'vue'
import { Document } from '@/models/Document'
import TableElement from './components/TableElement'

type DocumentsListSetup = {
  selectedDocuments: Document[]
}

const defaultProps: DocumentsListProps = {
  documentsListWithTableStructure: documentsResponsePayload
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
          template: '<span />'
        }
      },
      plugins: [pinia]
    }
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
              template: '<span />'
            }
          },
          plugins: [pinia]
        }
      }) as unknown as DocumentsListWrapper

      wrapper.find('.el-table__cell')
      await nextTick()

      const colomuns = wrapper.findAllComponents(PTableColumn)
      await nextTick()
      expect(colomuns).toHaveLength(8)

    }, 30000)
  })
  describe('events', () => {
    // Pas sreussi a récupéré table element
    it('should emit on-sort-change when sort-change', async () => {
      const emitPayload =
        // eslint-disable-next-line max-len
        '{"column":{"order":"ascending","id":"el-table_2_column_11","type":"default","align":null,"headerAlign":null,"showOverflowTooltip":false,"filteredValue":[],"filterPlacement":"","isColumnGroup":false,"isSubColumn":false,"filterOpened":false,"sortable":true,"rawColumnKey":0,"label":"Nom du document","fixed":false,"resizable":true,"sortOrders":["ascending","descending",null],"reserveSelection":false,"filterMultiple":true,"width":591,"minWidth":80,"realWidth":591,"no":2,"level":1,"colSpan":1,"rowSpan":1},"order":"ascending"}'

      const wrapper = createWrapper()

      wrapper.find('.el-table__cell')
      await nextTick()

      const table = await wrapper.findComponent(PTable)
      await nextTick()
      await table.vm.$emit('sort-change', JSON.parse(emitPayload))
      await nextTick()

      expect(wrapper.emitted('on-sort-change')).toBeTruthy()
      expect(wrapper.emitted('on-sort-change')).toStrictEqual([['+name']])
    }, 30000)

    // Pas sreussi a récupéré table element
    it('should emit document-selection-change oppon ptable selection-change event', async () => {
      const wrapper = createWrapper()
      wrapper.find('.el-table__cell')
      await nextTick()

      const table = wrapper.findComponent(PTable)
      await nextTick()

      await table.vm.$emit(
        'selection-change',
        documentsResponsePayload.documentsPage.items
      )
      await nextTick()

      expect(wrapper.emitted('document-selection-change')).toBeTruthy()
      expect(wrapper.emitted('document-selection-change')).toStrictEqual([
        [documentsResponsePayload.documentsPage.items]
      ])
    }, 30000)

    it('should select row oppon TableElement actions-dropdown-opened', async () => {
      const wrapper: DocumentsListWrapper = mount(DocumentsList, {
        props: defaultProps,
        global: {
          stubs: {
            PToolbox: {
              template: '<span />'
            }
          },
          plugins: [pinia]
        }
      }) as unknown as DocumentsListWrapper

      await nextTick()

      wrapper.find('.el-table__cell')
      await nextTick()

      const tableElements = wrapper.findAllComponents(TableElement)

      await tableElements[0].vm.$emit('actions-dropdown-opened',
        documentsResponsePayload.documentsPage.items[0])

      await nextTick()
      const componentInstance = wrapper.vm

      expect(
        componentInstance.selectedDocuments
      ).toStrictEqual(documentsResponsePayload.documentsPage.items)
    })

    it('should propagate toolbox-action-triggered of tableElement', async () => {
      const wrapper: DocumentsListWrapper = mount(DocumentsList, {
        props: defaultProps,
        global: {
          stubs: {
            PToolbox: {
              template: '<span />'
            }
          },
          plugins: [pinia]
        }
      }) as unknown as DocumentsListWrapper

      await nextTick()

      wrapper.find('.el-table__cell')
      await nextTick()

      const tableElements = wrapper.findAllComponents(TableElement)

      await tableElements[0].vm.$emit('toolbox-action-triggered')

      await nextTick()

      expect(wrapper.emitted('toolbox-action-triggered')).toBeTruthy()
    })
  })
})
