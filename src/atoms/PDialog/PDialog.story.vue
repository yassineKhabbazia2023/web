<template>
  <Story title="2. Atoms/PDialog" icon="">
    <Variant title="Dialog">
      <PButton @click="showDialog">
          Open Dialog
      </PButton>

      <PDialog
      v-model="pDialogControl.dialogVisible"
      :title="pDialogControl.dialogTitle"
      :width="pDialogControl.dialogWidth"
      :modal="pDialogControl.dialogModal"
      :center="pDialogControl.dialogCenter"
      :beforeClose="closeDialog">
          <!-- Dialog content goes here -->
          <p>Custom Dialog Content</p>
      </PDialog>
      <template #controls>
          <HstCheckbox v-model="pDialogControl.dialogVisible" title="dialogVisible" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PDialog from '.'
import PButton from '@/atoms/PButton'
import { reactive } from 'vue'

const showDialog = () => {
  pDialogControl.dialogVisible = true
}
const closeDialog = () => {
  pDialogControl.dialogVisible = false
}
const pDialogControl = reactive({
  dialogVisible: false,
  dialogTitle: 'My Dialog',
  dialogWidth: '50%',
  dialogModal: true,
  dialogAppendToBody: true,
  dialogCenter: true,
  dialogLockScroll: false,
  dialogShowClose: true,
  dialogCloseOnClickModal: true,
  dialogCloseOnPressEscape: true,
  dialogCustomClass: 'my-dialog-class'
})
</script>
