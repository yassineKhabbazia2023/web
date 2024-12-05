<template>
  <Story
    title="4. Organisms/ConfirmationPopup"
    :layout="{
      type: 'single',
      iframe: true
    }"
  >
    <Variant title="PConfirmationPopup">
      <PButton @click="pIsVisible = !pIsVisible">
        Open Dialog
      </PButton>

      <PConfirmationPopup
        :pIsVisible="pIsVisible"
        :pTitle="pTitle"
        :pConfirmButtonContent="pConfirmButtonContent"
        :pCancelButtonContent="pCancelButtonContent"
        :pConfirmButtonIsLoading="pConfirmButtonIsLoading"
        :pAlignCenter="pAlignCenter"
        :pNoCloseButton="pNoCloseButton"
        @update:p-is-visible="onUpdatePIsVisible"
        @on-confirm-button-click="onClickConfirmButton"
        @on-cancel-button-click="onClickCancelButton"
        @on-close-popup="onClickClose"
      >
        <p>{{ message }}</p>
      </PConfirmationPopup>
      <template #controls>
        <HstCheckbox v-model="pIsVisible" title="pIsVisible" />
        <HstText v-model="pTitle" title="pTitle" />
        <HstText v-model="message" title="message" />
        <HstText v-model="pConfirmButtonContent" title="pConfirmButtonContent" />
        <HstText v-model="pCancelButtonContent" title="pCancelButtonContent" />
        <HstText v-model="pCancelButtonContent" title="pCancelButtonContent" />
        <HstCheckbox v-model="pConfirmButtonIsLoading" title="pConfirmButtonIsLoading" />
        <HstCheckbox v-model="pAlignCenter" title="pAlignCenter" />
        <HstCheckbox v-model="pNoCloseButton" title="pNoCloseButton" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { logEvent } from 'histoire/client'
import PConfirmationPopup from '.'
import PButton from '../../atoms/PButton'
import { ref } from 'vue'

const pIsVisible = ref(false)
const pTitle = ref('Confirmation')
const message = ref('Acceptez-vous cette action ?')
const pConfirmButtonContent = ref('Yes')
const pCancelButtonContent = ref('No')
const pConfirmButtonIsLoading = ref(false)
const pAlignCenter = ref(true)
const pNoCloseButton = ref(true)

function setPIsVisible(isVisible: boolean) {
  pIsVisible.value = isVisible
}
function onUpdatePIsVisible(isVisible: boolean) {
  setPIsVisible(isVisible)
  logEvent('on-update-p-is-visible', undefined)
}
function onClickConfirmButton() {
  logEvent('on-confirm-button-click', undefined)
  setPIsVisible(false)
}
function onClickCancelButton() {
  setPIsVisible(false)
  logEvent('on-cancel-button-click', undefined)
}
function onClickClose() {
  logEvent('on-close-popup', undefined)
  setPIsVisible(false)
}
</script>
