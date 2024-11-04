import { describe, it, expect, beforeEach } from 'vitest'
import TableElement from './TableElement.vue'
import { type TableElementPops } from './TableElementTypes'
import type { Document } from '@ged/models/Document'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { formatDateStr } from '@ged/modules/common/helpers/dateFormatHelper'
import {
  PIArrowRepeat,
  PIcon,
  PIFileText,
  PIFiletypeBmp,
  PIFiletypeCsv,
  PIFiletypeDoc,
  PIFiletypeDocx,
  PIFiletypeGif,
  PIFiletypeHeic,
  PIFiletypeJpg,
  PIFiletypeMd,
  PIFiletypePdf,
  PIFiletypePng,
  PIFiletypePpt,
  PIFiletypePptx,
  PIFiletypeRaw,
  PIFiletypeSvg,
  PIFiletypeTiff,
  PIFiletypeTxt,
  PIFiletypeXls,
  PIFiletypeXlsx,
  PIFiletypeXml,
  PIStars,
  PTag,
  PICheckCircle,
  PIExclamationTriangle,
  PDoubleText,
} from '@pulse/styleguide'
import DocumentActions from '@ged/modules/Documents/sections/DocumentsList/components/DocumentsActions'

const document: Document = {
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

const pinia = createPinia()

const createWrapper = (
  props: TableElementPops = defaultProps,
): TableElementWrapper => {
  return mount(TableElement, {
    props,
    global: {
      stubs: {
        PToolbox: {
          template: '<span />',
        },
        plugins: [pinia],
      },
    },
  }) as unknown as TableElementWrapper
}

describe('tableElement', () => {
  describe('props', () => {
    // eslint-disable-next-line vitest/no-hooks
    beforeEach(() => {
      setActivePinia(pinia)
    })

    describe('should map PText component correctly based on fieldType', () => {
      const cases = [
        {
          document: defaultProps.data,
          fieldType: 'Text',
          expectedResult: {
            component: '.p-text',
            content: formatDateStr(document.created),
            hasIcon: false,
          },
        },
        {
          document: defaultProps.data,
          fieldType: 'DocumentName',
          expectedResult: {
            component: '.p-text',
            content: document.name,
            hasIcon: true,
          },
        },
      ]

      // eslint-disable-next-line vitest/prefer-expect-assertions
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

        const tag = wrapper.find('.p-text')
        await nextTick()
        expect(tag.exists()).toBeTruthy()
        expect(tag.element.textContent).toStrictEqual(
          cases[0].expectedResult.content,
        )
        const icon = wrapper.findComponent(PIcon)
        expect(icon.exists()).toBeFalsy()
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

        const tag = wrapper.find('.p-text')
        await nextTick()
        expect(tag.exists()).toBeTruthy()
        expect(tag.element.textContent).toStrictEqual(
          cases[1].expectedResult.content,
        )
        const icon = wrapper.findComponent(PIcon)
        expect(icon.exists()).toBeTruthy()
      })
    })

    describe('should map DocumentName icons correctly based on file name extension', () => {
      const cases = [
        {
          fileName: 'test.bmp',
          expectedIcon: PIFiletypeBmp,
        },
        {
          fileName: 'test.csv',
          expectedIcon: PIFiletypeCsv,
        },
        {
          fileName: 'test.doc',
          expectedIcon: PIFiletypeDoc,
        },
        {
          fileName: 'test.docx',
          expectedIcon: PIFiletypeDocx,
        },
        {
          fileName: 'test.gif',
          expectedIcon: PIFiletypeGif,
        },
        {
          fileName: 'test.heic',
          expectedIcon: PIFiletypeHeic,
        },
        {
          fileName: 'test.jpg',
          expectedIcon: PIFiletypeJpg,
        },
        {
          fileName: 'test.md',
          expectedIcon: PIFiletypeMd,
        },
        {
          fileName: 'test.pdf',
          expectedIcon: PIFiletypePdf,
        },
        {
          fileName: 'test.png',
          expectedIcon: PIFiletypePng,
        },
        {
          fileName: 'test.ppt',
          expectedIcon: PIFiletypePpt,
        },
        {
          fileName: 'test.pptx',
          expectedIcon: PIFiletypePptx,
        },
        {
          fileName: 'test.raw',
          expectedIcon: PIFiletypeRaw,
        },
        {
          fileName: 'test.svg',
          expectedIcon: PIFiletypeSvg,
        },
        {
          fileName: 'test.tiff',
          expectedIcon: PIFiletypeTiff,
        },
        {
          fileName: 'test.txt',
          expectedIcon: PIFiletypeTxt,
        },
        {
          fileName: 'test.xls',
          expectedIcon: PIFiletypeXls,
        },
        {
          fileName: 'test.xlsx',
          expectedIcon: PIFiletypeXlsx,
        },
        {
          fileName: 'test.xml',
          expectedIcon: PIFiletypeXml,
        },
        {
          fileName: 'test.unknown',
          expectedIcon: PIFileText,
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

          wrapper.find('.p-text')
          await nextTick()

          const icon = wrapper.findComponent(expectedIcon)
          expect(icon.exists()).toBeTruthy()
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

        const pDoubleText = wrapper.findComponent(PDoubleText)
        expect(pDoubleText.exists()).toBeTruthy()
      })
    describe('ptag validation', () => {
      const cases = [
        {
          document: defaultProps.data,
          fieldType: 'Tag',
          fieldName: '',
          expectedResult: {
            component: PTag,
            text: 'Certifié',
          },
        },
        {
          document: defaultProps.data,
          fieldType: 'Tag',
          fieldName: '',
          expectedResult: {
            component: PTag,
            text: 'Certifié',
          },
        },
      ]

      it.each(cases)(
        'should map PTag component correctly based on fieldType',
        async ({ document, fieldType, expectedResult }) => {
          const props: TableElementPops = {
            ...defaultProps,
            fieldType,
            data: document,
          }

          const wrapper = createWrapper(props)

          const tag = wrapper.findComponent(expectedResult.component)
          await nextTick()
          expect(tag.exists()).toBeTruthy()
          expect(tag.text()).toBe(expectedResult.text)
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
          properties: { syncStatus: '', HasSubscribedToVault: 'Non' },
        },
      }

      const wrapper = createWrapper(props)

      await nextTick()
      expect(wrapper.findComponent(PTag).exists()).toBeFalsy()
    })

    describe('set the correct tag icon and type based on pia status', () => {
      const cases = [
        {
          status: 'New',
          expectedIcon: PIStars,
        },
        {
          status: 'Collectable',
          expectedIcon: PIArrowRepeat,
        },
        {
          status: 'Collected',
          expectedIcon: PICheckCircle,
        },
        {
          status: 'Duplicate',
          expectedIcon: PICheckCircle,
        },
        {
          status: 'Error',
          expectedIcon: PIExclamationTriangle,
        },
        {
          status: 'Archived',
          expectedIcon: PICheckCircle,
        },
        {
          status: 'NotTransmitted',
          expectedIcon: PIExclamationTriangle,
        },
        {
          status: 'Unknown',
          expectedIcon: PIExclamationTriangle,
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

          const pTagWrapper = wrapper.findComponent(PTag)
          await nextTick()

          expect(pTagWrapper.props('pIconLeft')).toBe(expectedIcon)
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
      const documentActions = wrapper.findComponent(DocumentActions)
      await nextTick()

      await documentActions.vm.$emit('actions-dropdown-opened')
      await nextTick()

      expect(wrapper.emitted('actions-dropdown-opened')).toBeTruthy()
    }, 30000)
  })
})
