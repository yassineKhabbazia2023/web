/* eslint-disable vitest/max-expects */
/* eslint-disable vitest/no-hooks */
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { type VueWrapper, mount } from '@vue/test-utils'
import { describe, expect, it, beforeEach } from 'vitest'
import
{
  PTooltip,
  PCollapse,
  PFileAndFolderLineCheck,
  PCollapseItem
} from '@kpmg/styleguide'
import { ExplorerDocument } from '@/modules/Documents/DocumentsTypes'
import DocumentsExplorerHeader
  from '@/modules/Documents/components/DocumentsExplorerModal/components/DocumentsExplorerHeader'
import { type DocumentsExplorerHeaderProps }
  from './DocumentsExplorerHeaderTypes'
import {
  getFileErrorMessage,
  getFileErrorDescription
} from '@/modules/common/helpers/documentCodeErrorHelper'

const defaultProps: DocumentsExplorerHeaderProps = {
  documents: [],
  headerTitle: 'header'
}

const pinia = createPinia()

const createWrapper = (
  props: DocumentsExplorerHeaderProps = defaultProps
): VueWrapper<any> => {
  return mount(DocumentsExplorerHeader, {
    props,
    global: {
      plugins: [pinia]
    }
  })
}
describe('documentsExplorerHeader', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })
  describe('props', () => {
    it('should not render PCollapse when no failed document', async () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBeTruthy()

      await nextTick()

      const collapse = wrapper.findComponent(PCollapse)
      await nextTick()

      expect(collapse.exists()).toBeFalsy()
    })

    it('should render PCollapse when failed document', async () => {
      const docs:Array<ExplorerDocument> = [
        {
          givenActionState: 'ERROR',
          content: { name: 'test.pdf' },
          codeError: 'FileEmpty',
          isSelected: false
        },
        {
          givenActionState: 'TO_DO',
          content: { name: 'kyaaaa.pdf' },
          codeError: '',
          isSelected: true
        }]
      const props: DocumentsExplorerHeaderProps = {
        ...defaultProps,
        documents: docs
      }

      const wrapper = createWrapper(props)
      await nextTick()

      const collapse = wrapper.findComponent(PCollapse)
      const collapseItem = wrapper.findComponent(PCollapseItem)
      const lines = wrapper.findAllComponents(PFileAndFolderLineCheck)
      const toolTips = wrapper.findAllComponents(PTooltip)
      await nextTick()

      expect(collapse.exists()).toBeTruthy()
      expect(collapseItem.props('pTitleCollapseItem')).toStrictEqual('header')
      expect(lines).toHaveLength(1)
      expect(toolTips).toHaveLength(1)
      expect(lines[0].props('pAdditionalText')).toStrictEqual(getFileErrorMessage('FileEmpty'))
      expect(toolTips[0].props('pContent')).toStrictEqual(getFileErrorDescription('FileEmpty'))
    })
  })
})

