<template>
  <PDialog
    v-model="isDialogOpen"
    :pWidth="dialogWidth"
    :pTitle="plainTitle"
    pTestId="demat-mail-dialog"
  >
    <template #header>
      <h2
        class="
          font-size--24
          font-semibold
          text-color--text-basic-heading
          line-height--inherit
          margin--0
          padding-right--11
        "
      >
        <i18n-t keypath="entities.dematMail.dialog.title">
          <template #highlight>
            <span class="text-color--jungle-400">
              {{ t('entities.dematMail.dialog.titleHighlight') }}
            </span>
          </template>
        </i18n-t>
      </h2>
    </template>

    <p
      class="
        font-size--14
        text-color--gray-900
        margin-bottom--4
      "
    >
      {{ t('entities.dematMail.dialog.firstParagraph') }}
    </p>
    <p
      class="
        font-size--14
        text-color--gray-900
        margin-bottom--4
      "
    >
      {{ t('entities.dematMail.dialog.secondParagraph') }}
    </p>

    <PForm
      ref="formRef"
      :pModel="formModel"
      :pRules="rules"
      pRequireAsteriskPosition="right"
    >
      <PFormItem
        pProp="email"
        :pLabel="t('entities.dematMail.dialog.emailLabel')"
        pRequired
      >
        <PInput
          v-model="formModel.email"
          pType="email"
          :pPlaceholder="t('entities.dematMail.dialog.emailPlaceholder')"
          pTestId="demat-mail-email-input"
        />
      </PFormItem>
    </PForm>

    <PAlert
      v-if="hasSubmitError"
      pType="danger"
      class="margin-top--4"
      data-testid="demat-mail-error-alert"
    >
      {{ t('entities.dematMail.dialog.submitError') }}
    </PAlert>

    <template #footer>
      <div :class="footerClasses">
        <PButton
          pType="tertiary"
          :class="footerButtonClasses"
          pTestId="demat-mail-assistance-button"
          @click="handleOpenAssistance"
        >
          {{ t('entities.dematMail.dialog.assistanceButton') }}
        </PButton>

        <div :class="footerActionsClasses">
          <PButton
            pType="secondary"
            :class="footerButtonClasses"
            pTestId="demat-mail-later-button"
            @click="handleClose"
          >
            {{ t('entities.dematMail.dialog.laterButton') }}
          </PButton>
          <PButton
            pType="primary"
            :pLoading="isSubmitting"
            :class="footerButtonClasses"
            pTestId="demat-mail-confirm-button"
            @click="handleConfirm"
          >
            {{ t('entities.dematMail.dialog.confirmButton') }}
            <PIcon
              pName="arrowRight"
              pSize="14"
              class="margin-left--2"
            />
          </PButton>
        </div>
      </div>
    </template>
  </PDialog>

  <PDialog
    v-model="isAssistanceOpen"
    :pWidth="overlaySize"
    pDestroyOnClose
    pTestId="demat-mail-assistance-dialog"
  >
    <iframe
      :src="assistanceIframeUrl"
      class="demat-mail-dialog__iframe width--100"
    />
  </PDialog>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import {
  PAlert,
  PButton,
  PDialog,
  PForm,
  PFormItem,
  PIcon,
  PInput,
} from '@pulse/styleguide/components'
import type { FormInstance } from '@pulse/styleguide/types'
import { BREAKPOINT_SIZES, useDialogAccessibleTitle, useOverlaySize, useResponsive } from '@pulse/styleguide'
import { useDematMailStore } from '@pulse/common/stores'
import { useDematMailDialog } from './demat-mail-dialog.composable'
import { createDematMailRules } from './demat-mail-dialog.validation'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

const formRef = useTemplateRef<FormInstance>('formRef')

const overlaySize = useOverlaySize()
const { width } = useResponsive()

const plainTitle = useDialogAccessibleTitle(
  t,
  'entities.dematMail.dialog.title',
  'entities.dematMail.dialog.titleHighlight',
)

// The design system flex utilities are not responsive, so the breakpoint is
// resolved here. Below md the three actions stack: laid out side by side they
// take different widths, which makes the transparent one look misaligned.
const isFooterStacked = computed(() => width.value < BREAKPOINT_SIZES.md)

// 591px matches the maquette exactly, but a fixed width overflows narrow
// viewports (nothing clamps .p-dialog to the screen) — below md it falls back
// to the same responsive sizing used for the rest of the app's overlays.
const dialogWidth = computed(() => (isFooterStacked.value ? overlaySize.value : '591px'))

const footerClasses = computed(() => (
  isFooterStacked.value
    ? ['flex', 'flex--direction-column', 'flex-gap--3']
    : ['flex', 'flex--align-items-center', 'flex--justify-content-space-between']
))

// element-plus spaces footer buttons with `.el-button + .el-button { margin-left }`
// (_dialog.scss): in a column that offsets the second one, so it is reset here
// and the full width is forced — `align-items: stretch` alone does not win over
// the element-plus button sizing.
const footerButtonClasses = computed(() => (
  isFooterStacked.value ? ['width--100', 'margin-left--0'] : []
))

const footerActionsClasses = computed(() => (
  isFooterStacked.value
    ? ['flex', 'flex--direction-column', 'flex-gap--3']
    : ['flex', 'flex-gap--3']
))

const { isSubmitting, hasSubmitError } = storeToRefs(useDematMailStore())

const {
  formModel,
  isDialogOpen,
  isAssistanceOpen,
  assistanceIframeUrl,
  handleConfirm,
  handleClose,
  handleOpenAssistance,
} = useDematMailDialog(formRef)

const rules = ref(createDematMailRules({
  emailRequired: t('entities.dematMail.dialog.emailRequired'),
  emailInvalid: t('entities.dematMail.dialog.emailInvalid'),
}))
</script>

<style scoped lang="scss">
// No design system utility covers the iframe viewport height.
.demat-mail-dialog__iframe {
  height: 70vh;
  border: none;
}
</style>
