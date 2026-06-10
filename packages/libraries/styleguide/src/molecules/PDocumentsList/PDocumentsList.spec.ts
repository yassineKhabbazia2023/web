import { mount } from '@vue/test-utils'
import PDocumentsList from './PDocumentsList.vue'
import PTable from '../../atoms/PTable'
import PTableColumn from '../../atoms/PTableColumn'
import PButton from '../../atoms/PButton'
import PIcon from '../../atoms/PIcon'
import type { DocumentsListItem, PDocumentsListProps } from './PDocumentsListTypes'

const baseData: DocumentsListItem[] = [
  {
    documentId: '1',
    documentName: 'contract-final.pdf',
    documentDepositDate: '15/03/2024',
  },
  {
    documentId: '2',
    documentName: 'report-annual.docx',
    documentDepositDate: '02/04/2024',
  },
  {
    documentId: '3',
    documentName: 'unknown-file.zzz',
    documentDepositDate: '01/06/2024',
  },
]

const createWrapper = (props: Partial<PDocumentsListProps> = {}) =>
  mount(PDocumentsList, {
    props: {
      pData: baseData,
      ...props,
    },
    global: {
      stubs: {
        PTable: {
          name: 'PTable',
          template: '<div class="p-table-stub"><slot /></div>',
          props: ['pData', 'pStripe', 'pRowKey'],
        },
        PTableColumn: {
          name: 'PTableColumn',
          template: `
            <div class="p-table-column-stub" :data-label="pLabel">
              <template v-for="(row, index) in $parent.pData" :key="index">
                <slot :row="row" />
              </template>
            </div>
          `,
          props: ['pLabel', 'pProp', 'pWidth', 'pAlign'],
        },
      },
    },
  })

describe('PDocumentsList', () => {
  describe('rendering', () => {
    it('forwards pData and pStripe to PTable', () => {
      const wrapper = createWrapper({ pStripe: true })
      const table = wrapper.findComponent(PTable)

      expect(table.exists()).toBe(true)
      expect(table.props('pData')).toEqual(baseData)
      expect(table.props('pStripe')).toBe(true)
      expect(table.props('pRowKey')).toBe('documentId')
    })

    it('renders four columns by default: name, deposited by, deposit date and options', () => {
      const wrapper = createWrapper()
      const columns = wrapper.findAllComponents(PTableColumn)

      expect(columns).toHaveLength(4)
      expect(columns[0].props('pLabel')).toBe('Nom du document')
      expect(columns[1].props('pLabel')).toBe('Déposé par')
      expect(columns[2].props('pLabel')).toBe('Déposé le')
      expect(columns[3].props('pLabel')).toBe('Options')
    })

    it('renders only the visible columns when pVisibleColumns is provided', () => {
      const wrapper = createWrapper({ pVisibleColumns: ['name', 'depositDate'] })
      const columns = wrapper.findAllComponents(PTableColumn)

      expect(columns).toHaveLength(2)
      expect(columns[0].props('pLabel')).toBe('Nom du document')
      expect(columns[1].props('pLabel')).toBe('Déposé le')
    })

    it('renders the document name with the matching extension icon', () => {
      const wrapper = createWrapper()
      const nameCells = wrapper.findAll('.p-documents-list__name-cell')

      expect(nameCells).toHaveLength(baseData.length)
      expect(nameCells[0].text()).toContain('contract-final.pdf')
      expect(nameCells[1].text()).toContain('report-annual.docx')

      const icons = wrapper.findAllComponents(PIcon)
      const iconNames = icons.map(icon => icon.props('pName'))
      expect(iconNames).toContain('filetypePdf')
      expect(iconNames).toContain('filetypeDocx')
    })

    it('uses the fallback icon when the extension is unknown', () => {
      const wrapper = createWrapper()
      const icons = wrapper.findAllComponents(PIcon)
      const iconNames = icons.map(icon => icon.props('pName'))

      expect(iconNames).toContain('filetypeNone')
    })
  })

  describe('default download action', () => {
    it('renders a download button for each row by default', () => {
      const wrapper = createWrapper()
      const optionsCells = wrapper.findAll('.p-documents-list__options-cell')

      expect(optionsCells).toHaveLength(baseData.length)
      optionsCells.forEach((cell) => {
        const icon = cell.findComponent(PIcon)
        expect(icon.props('pName')).toBe('download')
      })
    })

    it('emits download with the document id when the default button is clicked', async () => {
      const wrapper = createWrapper()
      const optionsCells = wrapper.findAll('.p-documents-list__options-cell')
      const firstDownloadButton = optionsCells[0].findComponent(PButton)

      await firstDownloadButton.trigger('click')

      expect(wrapper.emitted('download')).toBeTruthy()
      expect(wrapper.emitted('download')?.[0]).toEqual([baseData[0].documentId])
    })
  })

  describe('custom options', () => {
    const customData: DocumentsListItem[] = [
      {
        documentId: '10',
        documentName: 'preview-and-delete.pdf',
        documentDepositDate: '01/01/2024',
        options: [
          { iconName: 'eye', event: 'preview' },
          { iconName: 'trash', event: 'delete' },
        ],
      },
      {
        documentId: '11',
        documentName: 'default.pdf',
        documentDepositDate: '02/02/2024',
      },
    ]

    it('renders the custom option buttons when options are provided', () => {
      const wrapper = createWrapper({ pData: customData })
      const optionsCells = wrapper.findAll('.p-documents-list__options-cell')
      const firstRowButtons = optionsCells[0].findAllComponents(PButton)

      expect(firstRowButtons).toHaveLength(2)
      expect(firstRowButtons[0].findComponent(PIcon).props('pName')).toBe('eye')
      expect(firstRowButtons[1].findComponent(PIcon).props('pName')).toBe('trash')
    })

    it('keeps the default download button for rows without options', () => {
      const wrapper = createWrapper({ pData: customData })
      const optionsCells = wrapper.findAll('.p-documents-list__options-cell')
      const secondRowButtons = optionsCells[1].findAllComponents(PButton)

      expect(secondRowButtons).toHaveLength(1)
      expect(secondRowButtons[0].findComponent(PIcon).props('pName')).toBe('download')
    })

    it('emits option with the event name and document id when a custom option is clicked', async () => {
      const wrapper = createWrapper({ pData: customData })
      const optionsCells = wrapper.findAll('.p-documents-list__options-cell')
      const firstRowButtons = optionsCells[0].findAllComponents(PButton)

      await firstRowButtons[0].trigger('click')

      expect(wrapper.emitted('option')).toBeTruthy()
      expect(wrapper.emitted('option')?.[0]).toEqual(['preview', customData[0].documentId])
    })

    it('treats an empty options array as no custom options', () => {
      const wrapper = createWrapper({
        pData: [{
          documentId: '20',
          documentName: 'empty-options.pdf',
          documentDepositDate: '03/03/2024',
          options: [],
        }],
      })
      const optionsCell = wrapper.find('.p-documents-list__options-cell')
      const buttons = optionsCell.findAllComponents(PButton)

      expect(buttons).toHaveLength(1)
      expect(buttons[0].findComponent(PIcon).props('pName')).toBe('download')
    })
  })
})
