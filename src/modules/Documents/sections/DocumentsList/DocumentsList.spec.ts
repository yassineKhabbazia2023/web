/* eslint-disable vitest/no-hooks */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import DocumentsList from './DocumentsList.vue'
import { mount } from '@vue/test-utils'
import type { DocumentsListProps } from './DocumentsListTypes'
import { documentsResponsePayload } from '../../mocks/documentsWithTableStructureDataMock'
import {
  dynamicUntilFound,
  dynamicUntilFoundComponent
} from '@kpmg/common/src/testing-helpers'

import { PTable, PTableColumn } from '@kpmg/styleguide'
import { nextTick } from 'vue'

const defaultProps: DocumentsListProps = {
  documentsListWithTableStructure: documentsResponsePayload
}
const createWrapper = (props: DocumentsListProps = defaultProps) => {
  return mount(DocumentsList, {
    props,
    global: {
      plugins: [pinia]
    }
  })
}

vi.mock('@kpmg/styleguide', () => {
  const PTable = vi.importActual('@kpmg/styleguide')
  const PTableColumn = vi.importActual('@kpmg/styleguide')
  const PActionBar = vi.importActual('@kpmg/styleguide')
  return {
    PTable,
    PTableColumn,
    PActionBar,
    PToolbox: {
      getBoundingClientRect: () => ({
        width: 100,
        height: 100,
        top: 0,
        left: 0
      })
    }
  }
})

vi.mock('@kpmg/common', async () => ({
  commonApi: () => ({
    ds: vi.fn()
  }),
  commonStore: () => ({
    $delete: vi.fn(),
    $patch: vi.fn(),
    $get: vi.fn(),
    $post: vi.fn()
  })
}))

const pinia = createPinia()

describe('documentList', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })

  vi.mock('@kpmg/styleguide', () => {
    const PTable = vi.importActual('@kpmg/styleguide')
    const PTableColumn = vi.importActual('@kpmg/styleguide')
    const PActionBar = vi.importActual('@kpmg/styleguide')
    return {
      PTable,
      PTableColumn,
      PActionBar,
      PToolbox: {
        getBoundingClientRect: () => ({
          width: 100,
          height: 100,
          top: 0,
          left: 0
        })
      }
    }
  })

  describe('props', () => {
    it('should render columns based on provided documentHeaders', async () => {
      const wrapper = createWrapper()

      await dynamicUntilFound(wrapper, '.el-table__cell')
      await nextTick()

      const colomuns = wrapper.findAllComponents(PTableColumn)
      await nextTick()
      const numberOfRetrievedDocuments =
        defaultProps.documentsListWithTableStructure.documentsPage.items.length
      const numberOfRetrievedHeaders =
        defaultProps.documentsListWithTableStructure.documentHeaders.length
      const expectedColumnsCount =
        (numberOfRetrievedHeaders + 1) * (numberOfRetrievedDocuments + 1)

      // eslint-disable-next-line no-console
      console.log(expectedColumnsCount)
      expect(colomuns).toHaveLength(0)
    })
  }, 30000)
  describe('events', () => {
    it('should emit on-sort-change when sort-change', async () => {
      const emitPayload =
        // eslint-disable-next-line max-len
        '{"column":{"order":"ascending","id":"el-table_2_column_11","type":"default","align":null,"headerAlign":null,"showOverflowTooltip":false,"filteredValue":[],"filterPlacement":"","isColumnGroup":false,"isSubColumn":false,"filterOpened":false,"sortable":true,"rawColumnKey":0,"label":"Nom du document","fixed":false,"resizable":true,"sortOrders":["ascending","descending",null],"reserveSelection":false,"filterMultiple":true,"width":591,"minWidth":80,"realWidth":591,"no":2,"level":1,"colSpan":1,"rowSpan":1},"order":"ascending"}'

      const wrapper = createWrapper()

      await dynamicUntilFound(wrapper, '.el-table__cell')
      await nextTick()

      const table = await dynamicUntilFoundComponent(wrapper, PTable)
      await nextTick()

      await table.vm.$emit('sort-change', JSON.parse(emitPayload))

      expect(wrapper.emitted('on-sort-change')).toBeTruthy()
      expect(wrapper.emitted('on-sort-change')).toStrictEqual([['+name']])
    })

    it('should emit on-selection-change when selection-change', async () => {
      const wrapper = createWrapper()

      await dynamicUntilFound(wrapper, '.el-table__cell')
      await nextTick()

      const table = await dynamicUntilFoundComponent(wrapper, PTable)
      await nextTick()

      const selectedDocuments = [
        {
          id: '1',
          name: 'Document 1',
          content: { href: '' },
          preview: { href: '' },
          updatedBy: 'User 1',
          updated: '2023-10-18',
          type: 'Type 1',
          size: 1000,
          comments: [],
          isUploadedInGedLoop: true,
          folder: { id: 1, path: [] },
          created: '2023-10-17',
          createdBy: 'User 2',
          account: { id: '', name: '' },
          properties: { syncStatus: '', HasSubscribedToVault: '' },
          lifecycleStatus: 'Status 1',
          paymentStatus: null,
          source: { id: 1, code: '', libelle: '' },
          piaStatus: { technicalName: '', labelFr: '', labelEn: '', date: '' },
          permissions: ['read', 'write'],
          isNew: false
        }
      ]
      await table.vm.$emit('selection-change', selectedDocuments)

      expect(wrapper.emitted('on-selection-change')).toBeTruthy()
      expect(wrapper.emitted('on-selection-change')).toStrictEqual([[selectedDocuments]])
    })
  }, 30000)
})
