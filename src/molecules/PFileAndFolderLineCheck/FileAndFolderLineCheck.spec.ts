import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import wrapperFactory from 'tests/utils/wrapperFactory'
import PFileAndFolderLineCheck from './'

type PFileAndFolderLineCheckState = 'default' | 'loading' | 'error' | 'success'
type PFileAndFolderLineCheckProps = {
  fileName: string
  additionalText?: string
  state?: PFileAndFolderLineCheckState
  modelValue: boolean
}

const defaultProps: PFileAndFolderLineCheckProps = {
  fileName: 'A file.pdf',
  modelValue: false
}
const componenRootCSSClass = 'p-file-and-folder-line-check'

const createWrapper = (props = defaultProps) =>
  wrapperFactory(PFileAndFolderLineCheck, {
    props
  })
describe('pFileAndFolderLineCheck', () => {
  describe('props', () => {
    it('should have the "default" state by default', () => {
      const wrapper = createWrapper()
      expect(wrapper.classes()).toContain(`${componenRootCSSClass}--default`)
    })

    it.each([
      {
        state: 'loading',
        expectedClassBinding: `${componenRootCSSClass}--loading`,
        expectedComponentToExistSelector: `.${componenRootCSSClass}__loader`
      },
      {
        state: 'error',
        expectedClassBinding: `${componenRootCSSClass}--error`,
        expectedComponentToExistSelector: `.${componenRootCSSClass}__icon`
      },
      {
        state: 'success',
        expectedClassBinding: `${componenRootCSSClass}--success`,
        expectedComponentToExistSelector: `.${componenRootCSSClass}__icon`
      }
    ])(
      'should always bind class based on current state',
      ({ state, expectedClassBinding, expectedComponentToExistSelector }) => {
        const wrapper = createWrapper({
          ...defaultProps,
          state: state as PFileAndFolderLineCheckState
        })
        expect(wrapper.classes()).toContain(expectedClassBinding)
        const elToExist = wrapper.find(expectedComponentToExistSelector)
        expect(elToExist.exists()).toBeTruthy()
      }
    )
  })

  describe('interactions', () => {
    it('should be selected on wrapper click', async () => {
      const modelValue = false

      // CCreating a wrapper component to test v-model
      const wrapper = mount({
        components: { PFileAndFolderLineCheck },
        template: `
        <PFileAndFolderLineCheck
          v-model="modelValue"
          state="default"
          fileName="test-file"
        />
      `,
        setup() {
          return {
            modelValue: ref(modelValue)
          }
        }
      })

      await wrapper.find('.p-file-and-folder-line-check').trigger('click')

      expect(wrapper.vm.modelValue).toBeTruthy()
      expect(wrapper.classes()).toContain(`${componenRootCSSClass}--selected`)
    })
  })
})
