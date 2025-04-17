import TableElement from './TableElement.vue'
import { type TableElementPops } from './TableElementTypes'
import type { TableRowDocument } from '@ged/models/Document'
import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import { nextTick } from 'vue'
import { formatDateStr } from '@ged/modules/common/helpers/dateFormatHelper'

const document: TableRowDocument = {
  id: '1',
  name: 'My Document',
  content: {
    href: 'https://example.com/document.pdf',
  },
  preview: {
    href: 'https://example.com/document_preview.png',
  },
  updatedBy: 'John Doe',
  updated: '2023-08-04T12:00:00Z',
  type: 'PDF',
  size: 1024,
  comments: [],
  isUploadedInGedLoop: null,
  folder: {
    id: 1,
    path: ['My Documents'],
  },
  created: '2023-08-04T12:00:00Z',
  createdBy: 'John Doe',
  account: {
    id: '1234567890',
    name: 'Acme Corporation',
  },
  properties: {
    syncStatus: 'SYNCED',
    HasSubscribedToVault: 'Oui',
  },
  lifecycleStatus: 'ACTIVE',
  paymentStatus: null,
  source: {
    id: 1,
    code: 'MY_SOURCE',
    libelle: 'My Source',
  },
  piaStatus: {
    technicalName: 'Collected',
    labelFr: 'Transmis',
    labelEn: 'Transmitted',
    date: '2023-08-04T12:00:00Z',
  },
  permissions: ['CAN_RENAME_DOCUMENT'],
  isNew: false,
  _rowIndex: 1,
}

const defaultProps: TableElementPops = {
  fieldType: '',
  fieldName: '',
  data: document,
}

type TableElementSetup = {
  isCertified:boolean
}

export type TableElementWrapper = VueWrapper<
  ComponentPublicInstance<TableElementPops, TableElementSetup>
>

const createWrapper = (
  props: TableElementPops = defaultProps,
) => shallowMount(TableElement, {
  props,
  global: {
    stubs: {
      PText: true,
      PDoubleText: true,
      PTag: true,
      DocumentActions: true,
    },
  },
})

describe('tableElement', () => {
  describe('props', () => {
    describe('should map PText component correctly based on fieldType', () => {
      const cases = [
        {
          document: defaultProps.data,
          fieldType: 'Text',
          expectedContent: formatDateStr(document.created),
        },
        {
          document: defaultProps.data,
          fieldType: 'DocumentName',
          expectedContent: document.name,
        },
      ]


      it('pText mapping validation test case Text without icon', async () => {
        const firstElementFieldType = cases[0].fieldType
        const firstDocument = cases[0].document
        const props: TableElementPops = {
          ...defaultProps,
          fieldType: firstElementFieldType,
          data: firstDocument,
          isInSearchScope: false,
        }

        const wrapper = createWrapper(props)

        const pText = wrapper.findComponent({ name: 'PText' })
        expect(pText.exists()).toBeTruthy()
        expect(pText.props('pContent')).toBe(cases[0].expectedContent)
        expect(pText.props('pIconName')).toBeUndefined()
      })

      it('pText mapping validation test case Text with icon', async () => {
        const firstElementFieldType = cases[1].fieldType
        const firstDocument = cases[1].document
        const props: TableElementPops = {
          ...defaultProps,
          fieldType: firstElementFieldType,
          data: firstDocument,
        }

        const wrapper = createWrapper(props)

        const pText = wrapper.findComponent({ name: 'PText' })

        expect(pText.exists()).toBeTruthy()
        expect(pText.props('pContent')).toBe(cases[1].expectedContent)
        expect(pText.props('pIconName')).toBe('fileText')
      })
    })

    describe('should map DocumentName icons correctly based on file name extension', () => {
      const cases = [
        {
          fileName: 'test.bmp',
          expectedIcon: 'filetypeBmp',
        },
        {
          fileName: 'test.csv',
          expectedIcon: 'filetypeCsv',
        },
        {
          fileName: 'test.doc',
          expectedIcon: 'filetypeDoc',
        },
        {
          fileName: 'test.docx',
          expectedIcon: 'filetypeDocx',
        },
        {
          fileName: 'test.gif',
          expectedIcon: 'filetypeGif',
        },
        {
          fileName: 'test.heic',
          expectedIcon: 'filetypeHeic',
        },
        {
          fileName: 'test.jpg',
          expectedIcon: 'filetypeJpg',
        },
        {
          fileName: 'test.md',
          expectedIcon: 'filetypeMd',
        },
        {
          fileName: 'test.pdf',
          expectedIcon: 'filetypePdf',
        },
        {
          fileName: 'test.png',
          expectedIcon: 'filetypePng',
        },
        {
          fileName: 'test.ppt',
          expectedIcon: 'filetypePpt',
        },
        {
          fileName: 'test.pptx',
          expectedIcon: 'filetypePptx',
        },
        {
          fileName: 'test.raw',
          expectedIcon: 'filetypeRaw',
        },
        {
          fileName: 'test.svg',
          expectedIcon: 'filetypeSvg',
        },
        {
          fileName: 'test.tiff',
          expectedIcon: 'filetypeTiff',
        },
        {
          fileName: 'test.txt',
          expectedIcon: 'filetypeTxt',
        },
        {
          fileName: 'test.xls',
          expectedIcon: 'filetypeXls',
        },
        {
          fileName: 'test.xlsx',
          expectedIcon: 'filetypeXlsx',
        },
        {
          fileName: 'test.xml',
          expectedIcon: 'filetypeXml',
        },
        {
          fileName: 'test.unknown',
          expectedIcon: 'fileText',
        },
      ]

      it.each(cases)(
        'icons validation with "%s"',
        async ({ fileName, expectedIcon }) => {
          const props: TableElementPops = {
            ...defaultProps,
            fieldType: 'DocumentName',
            data: { ...document, name: fileName },
          }

          const wrapper = createWrapper(props)

          const pText = wrapper.findComponent({ name: 'PText' })
          expect(pText.props('pIconName')).toBe(expectedIcon)
        },
      )
    })
    it('should use pdoubletext component when filedType is DocumentName and in search scope',
      () => {
        const props : TableElementPops = {
          ...defaultProps,
          isInSearchScope: true,
          fieldType: 'DocumentName',
        }

        const wrapper = createWrapper(props)

        const pDoubleText = wrapper.findComponent({ name: 'PDoubleText' })
        expect(pDoubleText.exists()).toBeTruthy()
      })
    describe('ptag validation', () => {
      const cases = [
        {
          document: defaultProps.data,
          fieldType: 'Tag',
          fieldName: '',
        },
        {
          document: defaultProps.data,
          fieldType: 'Tag',
          fieldName: '',
        },
      ]

      it.each(cases)(
        'should map PTag component correctly based on fieldType',
        async ({ document, fieldType }) => {
          const props: TableElementPops = {
            ...defaultProps,
            fieldType,
            data: document,
          }

          const wrapper = createWrapper(props)

          const tag = wrapper.findComponent({ name: 'PTag' })

          expect(tag.exists()).toBeTruthy()
          expect(tag.props('pContent')).toBe('Certifié')
        },
      )
    })
    it('should hide certified tag when document is not certified', async () => {
      const props: TableElementPops =
      {
        ...defaultProps,
        fieldType: 'Tag',
        fieldName: '',
        data: {
          ...document,
          properties: { syncStatus: '' },
        },
      }

      const wrapper = createWrapper(props)

      await nextTick()
      expect(wrapper.findComponent({ name: 'PTag' }).exists()).toBeFalsy()
    })

    describe('set the correct tag icon and type based on pia status', () => {
      const cases = [
        {
          status: 'New',
          expectedIcon: 'stars',
        },
        {
          status: 'Collectable',
          expectedIcon: 'arrowRepeat',
        },
        {
          status: 'Collected',
          expectedIcon: 'checkCircle',
        },
        {
          status: 'Duplicate',
          expectedIcon: 'checkCircle',
        },
        {
          status: 'Error',
          expectedIcon: 'exclamationTriangle',
        },
        {
          status: 'Archived',
          expectedIcon: 'checkCircle',
        },
        {
          status: 'NotTransmitted',
          expectedIcon: 'exclamationTriangle',
        },
        {
          status: 'Unknown',
          expectedIcon: 'exclamationTriangle',
        },
      ]

      it.each(cases)(
        'pia status icons validation with "%s"',
        async ({ status, expectedIcon }) => {
          const props: TableElementPops = {
            ...defaultProps,
            fieldType: 'Tag',
            fieldName: 'Statut',
            data: {
              ...document,
              piaStatus: {
                technicalName: status,
                labelEn: '',
                labelFr: '',
                date: defaultProps.data.piaStatus.date,
              },
            },
          }

          const wrapper = createWrapper(props)

          await nextTick()

          const pTagWrapper = wrapper.findComponent({ name: 'PTag' })
          await nextTick()

          expect(pTagWrapper.props('pIconLeftName')).toBe(expectedIcon)
        },
      )
    })
  })

  describe('events', () => {
    it('should emit actions-dropdown-opened when document action dropdown is opened', async () => {
      const updatedProps: TableElementPops = {
        fieldName: '',
        fieldType: 'ActionGroup',
        data: document,
      }
      const wrapper = createWrapper(updatedProps)
      const documentActions = wrapper.findComponent({ name: 'DocumentActions' })
      await nextTick()

      await documentActions.vm.$emit('actions-dropdown-opened')
      await nextTick()

      expect(wrapper.emitted('actions-dropdown-opened')).toBeTruthy()
    }, 30000)
  })
})
