import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import wrapperFactory from '../../tests/utils/wrapperFactory'
import PFileAndFolderLineCheck from './'
import type { PFileAndFolderLineCheckProps } from './PFileAndFolderLineCheckTypes'

type PFileAndFolderLineCheckState = PFileAndFolderLineCheckProps['pState']

const defaultProps: PFileAndFolderLineCheckProps = {
  pFileName: 'A file.pdf',
  modelValue: false,
}
const componenRootCSSClass = 'p-file-and-folder-line-check'

const createWrapper = (props = defaultProps) =>
  wrapperFactory(PFileAndFolderLineCheck, {
    props,
  })
describe('pFileAndFolderLineCheck', () => {
  describe('props', () => {
    it('should have the "default" pState by default', () => {
      const wrapper = createWrapper()
      expect(wrapper.classes()).toContain(`${componenRootCSSClass}--default`)
    })

    it.each([
      {
        pState: 'loading',
        expectedClassBinding: `${componenRootCSSClass}--loading`,
        expectedComponentToExistSelector: `.${componenRootCSSClass}__loader`,
        expectedIconCount: 1,
        expectedIconName: 'filetypePdf',
        expectedStateIconCssClass: undefined,
      },
      {
        pState: 'error',
        expectedClassBinding: `${componenRootCSSClass}--error`,
        expectedComponentToExistSelector: `.${componenRootCSSClass}__icon`,
        expectedIconCount: 2,
        expectedIconName: 'exclamationTriangle',
        expectedStateIconCssClass: `${componenRootCSSClass}__icon--error`,
      },
      {
        pState: 'success',
        expectedClassBinding: `${componenRootCSSClass}--success`,
        expectedComponentToExistSelector: `.${componenRootCSSClass}__icon`,
        expectedIconCount: 2,
        expectedIconName: 'checkCircle',
        expectedStateIconCssClass: `${componenRootCSSClass}__icon--success`,
      },
    ])(
      'should always bind class based on current state $pState',
      ({
        pState,
        expectedClassBinding,
        expectedComponentToExistSelector,
        expectedIconCount,
        expectedIconName,
        expectedStateIconCssClass,
      }) => {
        const wrapper = createWrapper({
          ...defaultProps,
          pState: pState as PFileAndFolderLineCheckState,
        })
        expect(wrapper.classes()).toContain(expectedClassBinding)
        const elToExist = wrapper.find(expectedComponentToExistSelector)
        expect(elToExist.exists()).toBeTruthy()

        const pIcons = wrapper.findAllComponents({ name: 'PIcon' })
        const pIcon = pIcons.at(0)
        expect(pIcons).toHaveLength(expectedIconCount)
        expect(pIcon?.props('pName')).toBe(expectedIconName)
        if (expectedStateIconCssClass !== undefined) {
          expect(elToExist.classes()).toContain(expectedStateIconCssClass)
        }
      },
    )

    it('should render the title and additional text only for success or error states', () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pState: 'success',
        pAdditionalText: 'Accountancy > Deposit > Purchases',
      })

      expect(wrapper.find(`.${componenRootCSSClass}__title`).text()).toBe(defaultProps.pFileName)
      expect(wrapper.find(`.${componenRootCSSClass}__details__additional-text`).text()).toBe('Accountancy > Deposit > Purchases')
    })
  })

  describe('interactions', () => {
    it('should be selected on wrapper click', async () => {
      const modelValue = false

      // Creating a wrapper component to test v-model
      const wrapper = mount({
        components: { PFileAndFolderLineCheck },
        template: `
        <PFileAndFolderLineCheck
          v-model="modelValue"
          pState="default"
          pFileName="test-file"
        />
      `,
        setup() {
          return {
            modelValue: ref(modelValue),
          }
        },
      })

      await wrapper.find('.p-file-and-folder-line-check').trigger('click')

      expect(wrapper.vm.modelValue).toBeTruthy()
      expect(wrapper.classes()).toContain(`${componenRootCSSClass}--selected`)

      const pIcon = wrapper.findComponent({ name: 'PIcon' })
      expect(pIcon.exists()).toBeTruthy()
      expect(pIcon.props('pName')).toBe('fileText')
    })
  })
})
