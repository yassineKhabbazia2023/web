<template>
  <Story title="2. Atoms/FileLineNavigation" icon="radix-icons:divider-horizontal">
    <Variant title="Default">
      <PFileLineNavigationItem
        :folderName="firstProps.folderName"
        :class="{ selected: firstProps.selected, disabled: firstProps.disabled }"
        :folderId="firstProps.folderId"
      />
      <template #controls>
        <HstText v-model="firstProps.folderName" title="FolderName" />
        <HstCheckbox v-model="firstProps.selected" title="selected" />
        <HstCheckbox v-model="firstProps.disabled" title="disabled" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import PFileLineNavigationItem from './'

const firstProps = reactive({
  selected: false,
  disabled: false,
  folderName: 'Name of folder',
  folderId: 3116446
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
