<template>
  <Story title="2. Atoms/FolderLineNavigation" icon="radix-icons:divider-horizontal">
    <Variant title="Default">
      <PFolderLineNavigationItem
        :pFolderName="firstProps.folderName"
        :pFolderId="firstProps.folderId"
        :pHasArrow="firstProps.pHasArrow"
        :pLeftIcon="firstProps.pLeftIcon"
        :pSelected="firstProps.selected"
        :pDisabled="firstProps.disabled"
        @on-click-folder-navigation="logEvent('on-click-folder-navigation', $event)"
        @on-db-click-folder-navigation="logEvent('on-db-click-folder-navigation', $event)"
      />
      <template #controls>
        <HstText v-model="firstProps.folderName" title="FolderName" />
        <HstText v-model="firstProps.pLeftIcon" title="pLeftIcon" />
        <HstCheckbox v-model="firstProps.disabled" title="disabled" />
        <HstCheckbox v-model="firstProps.pHasArrow" title="pHasArrow" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { logEvent } from 'histoire/client'
import PFolderLineNavigationItem from './'

const firstProps = reactive({
  selected: false,
  disabled: false,
  folderName: 'Name of folder',
  folderId: 3116446,
  pHasArrow: true,
  pLeftIcon: 'PIFolder'
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
