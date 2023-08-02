<template>
  <Story title="2. Atoms/Dialog" icon="">
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
        <p class="p-dialog-text">
          {{ pDialogControl.dialogContent }}
        </p>
        <template #footer>
          <div class="p-dialog-footer">
            <PButton
              type="secondary"
              size="small"
              :plain="false"
              :round="false"
              :disabled="false"
              :loading="false"
              @click="closeDialog"
            >
              Fermer
            </PButton>
          </div>
        </template>
      </PDialog>
      <template #controls>
        <HstText v-model="pDialogControl.dialogTitle" title="title" />
        <HstText v-model="pDialogControl.dialogContent" title="content" />
      </template>
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
        <p class="p-dialog-text">
          Suppression définitive du fichier. Continuer ?
        </p>
        <template #footer>
          <div class="p-dialog-footer">
            <PButton
              type="secondary"
              size="small"
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
              size="small"
              :plain="false"
              :round="false"
              :disabled="false"
              :loading="false"
              @click="closeSecondDialog"
            >
              Continuer
            </PButton>
          </div>
        </template>
      </PDialog>
    </Variant>

    <Variant title="Dialog input">
      <PButton @click="showThirdDialog">
        Open Dialog
      </PButton>

      <PDialog
        v-model="pThirdDialogControl.dialogVisible"
        :title="pThirdDialogControl.dialogTitle"
        :width="pThirdDialogControl.dialogWidth"
        :modal="pThirdDialogControl.dialogModal"
        :center="pThirdDialogControl.dialogCenter"
        :beforeClose="closeThirdDialog"
      >
        <!-- Dialog content goes here -->
        <p class="p-dialog-text-fichier">
          Veuillez saisir le nom de votre fichier
        </p>
        <div class="p-dialog-input">
          <PInput
            type="text"
            :disabled="false"
            placeholder="Nom du fichier"
            v-model="pThirdDialogControl.dialogInput"
          />
          <p class="p-dialog-input-extension">
            .jpg
          </p>
        </div>
        <template #footer>
          <div class="p-dialog-footer">
            <PButton
              type="secondary"
              size="small"
              :plain="false"
              :round="false"
              :disabled="false"
              :loading="false"
              @click="closeThirdDialog"
            >
              Annuler
            </PButton>
            <PButton
              type="primary"
              size="small"
              :plain="false"
              :round="false"
              :disabled="false"
              :loading="false"
              @click="closeThirdDialog"
            >
              Continuer
            </PButton>
          </div>
        </template>
      </PDialog>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PDialog from '.'
import PButton from '@/atoms/PButton'
import PInput from '@/atoms/PInput'
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
  dialogCustomClass: 'my-dialog-class',
  dialogContent: 'This is a message'
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

const showThirdDialog = () => {
  pThirdDialogControl.dialogVisible = true
}

const closeThirdDialog = () => {
  pThirdDialogControl.dialogVisible = false
  pThirdDialogControl.dialogInput = ''
}

const pThirdDialogControl = reactive({
  dialogVisible: false,
  dialogTitle: 'Saisie rapide',
  dialogWidth: '40%',
  dialogModal: true,
  dialogAppendToBody: true,
  dialogCenter: true,
  dialogLockScroll: false,
  dialogShowClose: true,
  dialogCloseOnClickModal: true,
  dialogCloseOnPressEscape: true,
  dialogCustomClass: 'my-dialog-class',
  dialogInput: ''
})
</script>

<style lang="scss" scoped>
.p-dialog-text {
  color: #000;
  font-size: 14px;
  font-weight: 400;
  line-height: 120%;
}
.p-dialog-text-fichier {
  color: #000;
  font-size: 14px;
  font-weight: 400;
  line-height: 120%;
  padding-bottom: 16px;
}
.p-dialog-input {
  display: flex;
  align-items: center;

  &-extension {
    color: var(--pulse-color-neutral-gray-900, #171717);
    padding-left: 8px;
  }
}
.p-dialog-footer {
  display: flex;
  justify-content: end;
}
</style>

<docs lang="md">
## PDialog
Dialog pops up a dialog box, and it's quite customizable.

<div class="responsive-iframe-container">
<iframe class="responsive-iframe" src="https://www.figma.com/file/hycpUsOrc1fFD7xcYY0ryN/%F0%9F%A6%84-Librairie-de-composants?node-id=2000%3A9478&mode=dev" allowfullscreen></iframe>
</div>
</docs>
