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
        :beforeClose="closeDialog"
      >
        <!-- Dialog content goes here -->
        <p class="dialog-text">
          This is a message
        </p>
        <template #footer>
          <span class="dialog-footer">
            <PButton
              type="secondary"
              size="default"
              :plain="false"
              :round="false"
              :disabled="false"
              :loading="false"
              @click="closeDialog"
            >
              Fermer
            </PButton>
          </span>
        </template>
      </PDialog>
    </Variant>

    <Variant title="Dialog warning">
      <PButton @click="showSecondDialog">
        Open Dialog
      </PButton>

      <PDialog
        v-model="pSecondDialogControl.dialogVisible"
        :title="pSecondDialogControl.dialogTitle"
        :width="pSecondDialogControl.dialogWidth"
        :modal="pSecondDialogControl.dialogModal"
        :center="pSecondDialogControl.dialogCenter"
        :beforeClose="closeSecondDialog"
      >
        <!-- Dialog content goes here -->
        <p class="dialog-text">
          Suppression définitive du fichier. Continuer ?
        </p>
        <template #footer>
          <span class="dialog-footer">
            <PButton
              type="secondary"
              size="default"
              :plain="false"
              :round="false"
              :disabled="false"
              :loading="false"
              @click="closeSecondDialog"
            >
              Annuler
            </PButton>
            <PButton
              type="primary"
              size="default"
              :plain="false"
              :round="false"
              :disabled="false"
              :loading="false"
              @click="closeSecondDialog"
            >
              Continuer
            </PButton>
          </span>
        </template>
      </PDialog>
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
  dialogTitle: 'Title',
  dialogWidth: '40%',
  dialogModal: true,
  dialogAppendToBody: true,
  dialogCenter: true,
  dialogLockScroll: false,
  dialogShowClose: true,
  dialogCloseOnClickModal: true,
  dialogCloseOnPressEscape: true,
  dialogCustomClass: 'my-dialog-class'
})

const showSecondDialog = () => {
  pSecondDialogControl.dialogVisible = true
}

const closeSecondDialog = () => {
  pSecondDialogControl.dialogVisible = false
}

const pSecondDialogControl = reactive({
  dialogVisible: false,
  dialogTitle: 'Avertissement',
  dialogWidth: '40%',
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

<style lang="scss" scoped>
.dialog-text {
  color: #000;
  font-size: 14px;
  font-weight: 400;
  line-height: 120%;
}
.dialog-footer {
  display: flex;
  justify-content: end;
}
</style>
