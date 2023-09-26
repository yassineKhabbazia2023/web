import { mount } from '@vue/test-utils'
import Ged from './'
// import Treeview from '@/modules/Treeview'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
// import {
//   dynamicUntilFound,
//   dynamicUntilFoundComponent
// } from '@kpmg/common/src/testing-helpers'
// import { Folder, FolderProperties } from '@/models/Folder'

const pinia = createPinia()

vi.mock('@kpmg/common', async () => ({
  commonApi: () => ({
    ds: vi.fn()
  }),
  commonStore: () => ({
    $delete: vi.fn(),
    $patch: vi.fn(),
    $get: vi.fn(),
    $post: vi.fn()
  })
}))

const createWrapper = () => {
  return mount(Ged, {
    global: {
      plugins: [pinia]
    }
  })
}

describe('ged', () => {
  // eslint-disable-next-line vitest/no-hooks
  beforeEach(() => {
    setActivePinia(pinia)
  })
  it('renders correctly', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBeTruthy()
  })
})

// describe('interactions', () => {
//   beforeEach(() => {
//     setActivePinia(pinia)
//   })
//   describe('treeview', () => {
//     it('should  when selected-folder-change emitted', async () => {
//       const wrapper = mount(Ged)
//       const treeview = await dynamicUntilFoundComponent(
//         wrapper,
//         Treeview
//       )

//       const folder = {
//         id: 1,
//         children: [
//           {
//             id: 2,
//             children: [{} as Folder],
//             name: 'TheFolder',
//             parent: { id: 1 },
//             permissions: [],
//             properties: {} as FolderProperties,
//             serviceId: 'some-service'
//           } as Folder
//         ],
//         name: 'A',
//         parent: { id: 0 },
//         permissions: [],
//         properties: {} as FolderProperties,
//         serviceId: 'some-service'
//       } as Folder

//       await treeview.vm.$emit(
//         'selected-folder-change',
//         folder
//       )

//       await wrapper.vm.$nextTick()
//     })
//   })
// })
