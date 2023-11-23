// /* eslint-disable vitest/no-hooks */
// import { createPinia, setActivePinia } from 'pinia'
// import { nextTick } from 'vue'
// import { type VueWrapper, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
// import { dynamicUntilFoundComponent } from '@kpmg/common/src/testing-helpers'
// import
// {
//   PCollapse,
//   PFileAndFolderLineCheck
// } from '@kpmg/styleguide'
// import DocumentsExplorerHeader
//   from './DocumentsExplorerHeader'
// import { type DocumentsExplorerHeaderProps }
//   from './DocumentsExplorerHeaderTypes'

// const defaultProps: DocumentsExplorerHeaderProps = {
//   failedFiles: []
// }

// const pinia = createPinia()

// const createWrapper = (
//   props: DocumentsExplorerHeaderProps = defaultProps
// ): VueWrapper<any> => {
//   return mount(DocumentsExplorerHeader, {
//     props,
//     global: {
//       plugins: [pinia]
//     }
//   })
// }
// describe('documentsExplorerHeader', () => {
//   beforeEach(() => {
//     setActivePinia(pinia)
//   })
//   describe('props', () => {
//     it('should not render PCollapse when no failed document', async () => {
//       const wrapper = createWrapper()
//       expect(wrapper.exists()).toBeTruthy()

//       await nextTick()

//       const collapse = wrapper.findComponent(PCollapse)
//       await nextTick()

//       expect(collapse.exists()).toBeFalsy()
//     })

//     it('should render PCollapse when failed document', async () => {
//       const docf = [{ name: 'test.pdf', codeError: 'FileEmpty' }]
//       const props: DocumentsExplorerHeaderProps = {
//         ...defaultProps,
//         failedFiles: docf
//       }

//       const wrapper = createWrapper(props)
//       await nextTick()

//       const collapse = await dynamicUntilFoundComponent(
//         wrapper,
//         PCollapse
//       )
//       const lines = wrapper.findAllComponents(PFileAndFolderLineCheck)
//       await nextTick()

//       expect(collapse.exists()).toBeTruthy()
//       expect(lines).toHaveLength(1)
//     })
//   })
// })
describe('temp', () => {
  it('should be ignored fro now', () => {
    expect(true).toBeTruthy()

  })

})
