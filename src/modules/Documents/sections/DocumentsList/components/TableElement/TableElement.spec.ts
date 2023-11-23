/* eslint-disable vitest/no-conditional-expect */
/* eslint-disable vitest/no-conditional-in-test */
/* eslint-disable vitest/no-conditional-tests */
import { describe, it, expect, beforeEach } from 'vitest'
import TableElement from './TableElement.vue'
import { type TableElementPops } from './TableElementTypes'
import { Document } from '@/models/Document'
import { VueWrapper, mount } from '@vue/test-utils'
import { ComponentPublicInstance, nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { dynamicUntilFound, dynamicUntilFoundComponent } from '@kpmg/common/src/testing-helpers'
import { formatDateStr } from '@/modules/common/helpers/dateFormatHelper'
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
  PIExclamationTriangle
} from '@kpmg/styleguide'
import DocumentActions from '@/modules/Documents/sections/DocumentsList/components/DocumentsActions'

const document: Document = {
  id: '1',
  name: 'My Document',
  content: {
    href: 'https://example.com/document.pdf'
  },
  preview: {
    href: 'https://example.com/document_preview.png'
  },
  updatedBy: 'John Doe',
  updated: '2023-08-04T12:00:00Z',
  type: 'PDF',
  size: 1024,
  comments: [],
  isUploadedInGedLoop: null,
  folder: {
    id: 1,
    path: ['My Documents']
  },
  created: '2023-08-04T12:00:00Z',
  createdBy: 'John Doe',
  account: {
    id: '1234567890',
    name: 'Acme Corporation'
  },
  properties: {
    syncStatus: 'SYNCED',
    HasSubscribedToVault: 'Oui'
  },
  lifecycleStatus: 'ACTIVE',
  paymentStatus: null,
  source: {
    id: 1,
    code: 'MY_SOURCE',
    libelle: 'My Source'
  },
  piaStatus: {
    technicalName: 'Collected',
    labelFr: 'Transmis',
    labelEn: 'Transmitted',
    date: '2023-08-04T12:00:00Z'
  },
  permissions: ['CAN_RENAME_DOCUMENT'],
  isNew: false
}

const defaultProps: TableElementPops = {
  fieldType: '',
  fieldName: '',
  data: document
}

type TableElementSetup = {
  isCertified:boolean
}

export type TableElementWrapper = VueWrapper<
  ComponentPublicInstance<TableElementPops, TableElementSetup>
>

const pinia = createPinia()

const createWrapper = (
  props: TableElementPops = defaultProps
): TableElementWrapper => {
  return mount(TableElement, {
    props,
    global: {
      stubs: {
        PToolbox: {
          template: '<span />'
        },
        plugins: [pinia]
      }
    }
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
            hasIcon: false
          }
        },
        {
          document: defaultProps.data,
          fieldType: 'DocumentName',
          expectedResult: {
            component: '.p-text',
            content: document.name,
            hasIcon: true
          }
        }
      ]

      it.each(cases)(
        'pText mapping validation',
        async ({ document, fieldType, expectedResult }) => {
          const props: TableElementPops = {
            ...defaultProps,
            fieldType,
            data: document
          }

          const wrapper = createWrapper(props)

          const tag = await dynamicUntilFound(wrapper, '.p-text')
          await nextTick()
          expect(tag.exists()).toBeTruthy()
          expect(tag.element.textContent).toStrictEqual(
            expectedResult.content
          )
          // eslint-disable-next-line vitest/no-conditional-in-test
          if (expectedResult.hasIcon) {
            const icon = await dynamicUntilFoundComponent(wrapper, PIcon)
            // eslint-disable-next-line vitest/no-conditional-expect
            expect(icon.exists()).toBeTruthy()
          }
        }
      )
    })

    describe('should map DocumentName icons correctly based on file name extension', () => {
      const cases = [
        {
          fileName: 'test.bmp',
          expectedIcon: PIFiletypeBmp
        },
        {
          fileName: 'test.csv',
          expectedIcon: PIFiletypeCsv
        },
        {
          fileName: 'test.doc',
          expectedIcon: PIFiletypeDoc
        },
        {
          fileName: 'test.docx',
          expectedIcon: PIFiletypeDocx
        },
        {
          fileName: 'test.gif',
          expectedIcon: PIFiletypeGif
        },
        {
          fileName: 'test.heic',
          expectedIcon: PIFiletypeHeic
        },
        {
          fileName: 'test.jpg',
          expectedIcon: PIFiletypeJpg
        },
        {
          fileName: 'test.md',
          expectedIcon: PIFiletypeMd
        },
        {
          fileName: 'test.pdf',
          expectedIcon: PIFiletypePdf
        },
        {
          fileName: 'test.png',
          expectedIcon: PIFiletypePng
        },
        {
          fileName: 'test.ppt',
          expectedIcon: PIFiletypePpt
        },
        {
          fileName: 'test.pptx',
          expectedIcon: PIFiletypePptx
        },
        {
          fileName: 'test.raw',
          expectedIcon: PIFiletypeRaw
        },
        {
          fileName: 'test.svg',
          expectedIcon: PIFiletypeSvg
        },
        {
          fileName: 'test.tiff',
          expectedIcon: PIFiletypeTiff
        },
        {
          fileName: 'test.txt',
          expectedIcon: PIFiletypeTxt
        },
        {
          fileName: 'test.xls',
          expectedIcon: PIFiletypeXls
        },
        {
          fileName: 'test.xlsx',
          expectedIcon: PIFiletypeXlsx
        },
        {
          fileName: 'test.xml',
          expectedIcon: PIFiletypeXml
        },
        {
          fileName: 'test.unknown',
          expectedIcon: PIFileText
        }
      ]

      it.each(cases)(
        'icons validation with "%s"',
        async ({ fileName, expectedIcon }) => {
          const props: TableElementPops = {
            ...defaultProps,
            fieldType: 'DocumentName',
            data: { ...document, name: fileName }
          }

          const wrapper = createWrapper(props)

          await dynamicUntilFound(wrapper, '.p-text')
          await nextTick()

          const icon = await dynamicUntilFoundComponent(wrapper, expectedIcon)
          expect(icon.exists()).toBeTruthy()
        }
      )
    })
    it('should map PTag component correctly based on fieldType', async () => {
      const cases = [
        {
          document: defaultProps.data,
          fieldType: 'Tag',
          fieldName: '',
          expectedResult: {
            component: PTag,
            content: 'Certifié'
          }
        },
        {
          document: defaultProps.data,
          fieldType: 'Tag',
          fieldName: '',
          expectedResult: {
            component: PTag,
            content: document.piaStatus.labelFr
          }
        }
      ]

      it.each(cases)(
        'ptag validation',
        async ({ document, fieldType, expectedResult }) => {
          const props: TableElementPops = {
            ...defaultProps,
            fieldType,
            data: document
          }

          const wrapper = createWrapper(props)

          const tag = await dynamicUntilFoundComponent(wrapper, expectedResult.component)
          await nextTick()
          expect(tag.exists()).toBeTruthy()
          expect(tag.element.textContent).toStrictEqual(expectedResult.content)
        }
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
          properties: { syncStatus: '', HasSubscribedToVault: 'Non' }
        }
      }

      const wrapper = createWrapper(props)

      await nextTick()
      expect(wrapper.findComponent(PTag).exists()).toBeFalsy()
    })

    describe('set the correct tag icon and type based on pia status', () => {
      const cases = [
        {
          status: 'New',
          expectedIcon: PIStars
        },
        {
          status: 'Collectable',
          expectedIcon: PIArrowRepeat
        },
        {
          status: 'Collected',
          expectedIcon: PICheckCircle
        },
        {
          status: 'Duplicate',
          expectedIcon: PICheckCircle
        },
        {
          status: 'Error',
          expectedIcon: PIExclamationTriangle
        },
        {
          status: 'Archived',
          expectedIcon: PICheckCircle
        },
        {
          status: 'NotTransmitted',
          expectedIcon: PIExclamationTriangle
        },
        {
          status: 'Unknown',
          expectedIcon: PIExclamationTriangle
        }
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
              piaStatus:
              {
                technicalName: status,
                labelEn: '',
                labelFr: '',
                date: defaultProps.data.piaStatus.date
              }
            }
          }

          const wrapper = createWrapper(props)

          const tag = await dynamicUntilFoundComponent(wrapper, PTag)
          await nextTick()

          const icon = await dynamicUntilFoundComponent(tag, expectedIcon)
          await nextTick()
          expect(icon.exists()).toBeTruthy()
        }
      )
    })
  })

  describe('events', () => {
    it('should emit actions-dropdown-opened when document action dropdown is opened', async () => {
      const updatedProps: TableElementPops = {
        fieldName: '',
        fieldType: 'ActionGroup',
        data: document
      }
      const wrapper = createWrapper(updatedProps)
      const documentActions = await dynamicUntilFoundComponent(
        wrapper,
        DocumentActions
      )
      await nextTick()

      await documentActions.vm.$emit('actions-dropdown-opened')
      await nextTick()

      expect(wrapper.emitted('actions-dropdown-opened')).toBeTruthy()
    }, 30000)
  })
})
