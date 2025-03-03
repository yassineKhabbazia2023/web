import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { validDestination, currentServiceFolder } from '@ged/__mocks__/files.mocks'
import type { VueWrapper } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import type { FoldersBreadCrumbProps } from './FoldersBreadCrumbTypes'
import type { BreadcrumbItems } from '@pulse/styleguide/types'

import FoldersBreadCrumb from '.'

const defaultProps: FoldersBreadCrumbProps = {
  currentFolder: validDestination,
  currentServiceFolder,
}

type FoldersBreadCrumbSetup = {
  breadCrumbItems:BreadcrumbItems
}

export type FoldersBreadCrumbWrapper = VueWrapper<
  ComponentPublicInstance<FoldersBreadCrumbProps, FoldersBreadCrumbSetup>
>

const createWrapper = (
  props: FoldersBreadCrumbProps = defaultProps,
): FoldersBreadCrumbWrapper => {
  return mount(FoldersBreadCrumb, {
    props,
  }) as unknown as FoldersBreadCrumbWrapper
}

describe('foldersBreadCrumb', () => {
  const findPBreadcrumb = (wrapper: FoldersBreadCrumbWrapper) => wrapper.findComponent({ name: 'PBreadcrumb' })

  const findCreateFolderButton = (wrapper: FoldersBreadCrumbWrapper) =>
    wrapper.find('.folders-breadcrumb__create-folder').findComponent({ name: 'PIcon' })

  describe('props', () => {
    it('should generate breadcrumb correctly', async () => {
      const expectedResult: BreadcrumbItems[] = [
        { pId: 135393636, pText: 'Comptabilité' },
        { pId: 135393637, pText: 'Dépôt' },
      ]
      const wrapper = createWrapper()

      await nextTick()

      expect(wrapper.vm.breadCrumbItems).toStrictEqual(expectedResult)
    })
  })

  describe('interactions', () => {
    it('should emit navigate-to-folder on p-breadcrumb-item-click', async () => {
      const wrapper = createWrapper()
      await nextTick()

      const pBreadCrumb = findPBreadcrumb(wrapper)

      await pBreadCrumb.vm.$emit('p-breadcrumb-item-click', validDestination.id)

      await nextTick()

      expect(wrapper.emitted('navigate-to-folder')).toHaveLength(1)
      expect(wrapper.emitted('navigate-to-folder')).toStrictEqual([
        [validDestination],
      ])
    })
    it('should open create folder modal when click on create folder icon', async () => {
      const wrapper = createWrapper()
      await nextTick()

      const createFolderButton = findCreateFolderButton(wrapper)

      createFolderButton.trigger('click')
      await nextTick()

      expect(wrapper.emitted('open-create-folder-modal')).toBeTruthy()
    })
  })
})
