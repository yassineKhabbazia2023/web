import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import wrapperFactory from '@styleguide/tests/utils/wrapperFactory'
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
      },
      {
        pState: 'error',
        expectedClassBinding: `${componenRootCSSClass}--error`,
        expectedComponentToExistSelector: `.${componenRootCSSClass}__icon`,
      },
      {
        pState: 'success',
        expectedClassBinding: `${componenRootCSSClass}--success`,
        expectedComponentToExistSelector: `.${componenRootCSSClass}__icon`,
      },
    ])(
      'should always bind class based on current state $pState',
      ({ pState, expectedClassBinding, expectedComponentToExistSelector }) => {
        const wrapper = createWrapper({
          ...defaultProps,
          pState: pState as PFileAndFolderLineCheckState,
        })
        expect(wrapper.classes()).toContain(expectedClassBinding)
        const elToExist = wrapper.find(expectedComponentToExistSelector)
        expect(elToExist.exists()).toBeTruthy()
      },
    )
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
    })
  })
})
