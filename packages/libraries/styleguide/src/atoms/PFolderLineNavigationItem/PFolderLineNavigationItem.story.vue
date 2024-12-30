<template>
  <Story title="2. Atoms/FolderLineNavigation" icon="radix-icons:divider-horizontal">
    <Variant title="Default">
      <PFolderLineNavigationItem
        :pFolderName="firstVariantProps.folderName"
        :pFolderId="firstVariantProps.folderId"
        :pHasArrow="firstVariantProps.pHasArrow"
        :pIconLeftName="firstVariantProps.pIconLeftName"
        :pSelected="firstVariantProps.selected"
        :pDisabled="firstVariantProps.disabled"
        @on-click-folder-navigation="logEvent('on-click-folder-navigation', $event)"
        @on-db-click-folder-navigation="logEvent('on-db-click-folder-navigation', $event)"
      />
      <template #controls>
        <HstText v-model="firstVariantProps.folderName" title="FolderName" />
        <HstText v-model="firstVariantProps.pIconLeftName" title="pIconLeftName" />
        <HstCheckbox v-model="firstVariantProps.disabled" title="disabled" />
        <HstCheckbox v-model="firstVariantProps.pHasArrow" title="pHasArrow" />
      </template>
    </Variant>

    <Variant title="Ellipsed because of long name">
      <PFolderLineNavigationItem
        :pFolderName="secondVariantProps.folderName"
        :pFolderId="secondVariantProps.folderId"
        :pHasArrow="secondVariantProps.pHasArrow"
        :pIconLeftName="secondVariantProps.pIconLeftName"
        :pSelected="secondVariantProps.selected"
        :pDisabled="secondVariantProps.disabled"
        @on-click-folder-navigation="logEvent('on-click-folder-navigation', $event)"
        @on-db-click-folder-navigation="logEvent('on-db-click-folder-navigation', $event)"
      />
      <template #controls>
        <HstText v-model="secondVariantProps.folderName" title="FolderName" />
        <HstText v-model="secondVariantProps.pIconLeftName" title="pIconLeftName" />
        <HstCheckbox v-model="secondVariantProps.disabled" title="disabled" />
        <HstCheckbox v-model="secondVariantProps.pHasArrow" title="pHasArrow" />
      </template>
    </Variant>

    <Variant title="Disabled">
      <PFolderLineNavigationItem
        :pFolderName="thirdVariantProps.folderName"
        :pFolderId="thirdVariantProps.folderId"
        :pHasArrow="thirdVariantProps.pHasArrow"
        :pIconLeftName="thirdVariantProps.pIconLeftName"
        :pSelected="thirdVariantProps.selected"
        :pDisabled="thirdVariantProps.disabled"
        :pTooltipContent="thirdVariantProps.pTooltipContent"
        @on-click-folder-navigation="logEvent('on-click-folder-navigation', $event)"
        @on-db-click-folder-navigation="logEvent('on-db-click-folder-navigation', $event)"
      />
      <template #controls>
        <HstText v-model="thirdVariantProps.folderName" title="FolderName" />
        <HstText v-model="thirdVariantProps.pIconLeftName" title="pIconLeftName" />
        <HstCheckbox v-model="thirdVariantProps.disabled" title="disabled" />
        <HstCheckbox v-model="thirdVariantProps.pHasArrow" title="pHasArrow" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { logEvent } from 'histoire/client'
import PFolderLineNavigationItem from './'
import { type IconName } from '../../types/IconName.types'

interface VariantProps {
  selected: boolean
  disabled: boolean
  folderName: string
  folderId: number
  pHasArrow: boolean
  pIconLeftName: IconName
  pTooltipContent?: string
}

const firstVariantProps = reactive<VariantProps>({
  selected: false,
  disabled: false,
  folderName: 'Name of folder',
  folderId: 3116446,
  pHasArrow: true,
  pIconLeftName: 'folder',
})

const secondVariantProps = reactive<VariantProps>({
  selected: false,
  disabled: false,
  folderName: 'This is a really really really looooooooooooooooooooooooooooooooooooooooooooooooooooooong name',
  folderId: 3116446,
  pHasArrow: true,
  pIconLeftName: 'folder',
  pTooltipContent: "Tooltip won't show",
})

const thirdVariantProps = reactive<VariantProps>({
  selected: false,
  disabled: true,
  folderName: 'A disabled line',
  folderId: 3116446,
  pHasArrow: true,
  pIconLeftName: 'folder',
  pTooltipContent: "You can't access this folder",
})
</script>

<docs lang="md">
  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe"
      src="https://www.figma.com/file/hycpUsOrc1fFD7xcYY0ryN/%F0%9F%A6%84-Librairie-de-composants?
      type=design&node-id=1344-6365&mode=design&t=hVRdmAH5RN6AN2wY-0;">
    </iframe>
  </div>
</docs>
