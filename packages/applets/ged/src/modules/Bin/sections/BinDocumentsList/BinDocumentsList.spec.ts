import BinDocumentsList from './BinDocumentsList.vue'
import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'

import type { BinDocumentsListProps } from '@ged/modules/Bin/sections/BinDocumentsList/BinDocumentsListTypes'
import { binDocumentsMock } from '../../mocks/binDocumentMock'
import { PTableColumn, PTable } from '@pulse/styleguide/components'
import { nextTick } from 'vue'
import BinTableElement from './components/BinTableElement'

const defaultProps: BinDocumentsListProps = {
  binDocuments: binDocumentsMock,
}

const createWrapper = (
  props: BinDocumentsListProps = defaultProps,
) => {
  return mount(BinDocumentsList, {
    props,
    global: {
      plugins: [pinia],
    },
  })
}

const pinia = createPinia()

describe('documentList', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })

  describe('props', () => {
    it('should render columns based on provided documentHeaders', async () => {
      expect.hasAssertions()

      const wrapper = createWrapper()
      await nextTick()

      const columns = wrapper.findAllComponents(PTableColumn)
      expect(columns).toHaveLength(3)

      const elements = wrapper.findAllComponents(BinTableElement)
      await nextTick()
      expect(elements).toHaveLength(3)
    })
  })
  describe('events', () => {
    it('should emit on-sort-change when sort-change', async () => {
      expect.hasAssertions()
      const emitPayload =

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
    })

    it('should propagate restore-document-action of BinTableElement', async () => {
      expect.hasAssertions()
      const wrapper = createWrapper()
      await nextTick()

      const tableElements = wrapper.findAllComponents(BinTableElement)

      await tableElements[0].vm.$emit(
        'restore-document-action',
        binDocumentsMock.documentsPage.items[0])

      await nextTick()

      expect(wrapper.emitted('restore-document-action')).toStrictEqual([
        [binDocumentsMock.documentsPage.items[0]],
      ])
    })
  })
})
