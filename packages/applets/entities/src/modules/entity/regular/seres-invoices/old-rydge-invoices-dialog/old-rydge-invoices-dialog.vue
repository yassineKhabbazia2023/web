<template>
  <PDialog
    v-model="isOpen"
    pWidth="528px"
    :pTitle="plainTitle"
    pTestId="old-rydge-invoices-dialog"
    pAlignCenter
  >
    <template #header>
      <div
        class="
          flex
          flex--direction-column
          flex--align-items-start
          flex-gap--4
        "
      >
        <PImage
          pType="logos"
          pName="brand-color"
          class="old-rydge-invoices-dialog__logo"
        />

        <h2
          class="
            font-size--28
            font-semibold
            text-color--text-basic-heading
            line-height--inherit
            margin--0
          "
        >
          <i18n-t keypath="entities.seresInvoices.oldInvoicesDialog.title">
            <template #highlight>
              <span class="text-color--jungle-400">
                {{ t('entities.seresInvoices.oldInvoicesDialog.titleHighlight') }}
              </span>
            </template>
          </i18n-t>
        </h2>
      </div>
    </template>

    <div
      class="
        flex
        flex--direction-column
        flex--align-items-start
        flex-gap--4
      "
    >
      <p
        class="
          font-size--14
          font-normal
          text-color--gray-900
          line-height--inherit
          margin--0
        "
      >
        {{ t('entities.seresInvoices.oldInvoicesDialog.description') }}
      </p>

      <div
        class="
          flex
          flex--justify-content-flex-end
          flex--align-items-center
          flex--align-self-stretch
          flex-gap--3
          margin-top--2
        "
      >
        <PButton
          pType="secondary"
          pTestId="old-rydge-invoices-assistance-button"
          @click="emit('assistance-click')"
        >
          {{ t('entities.seresInvoices.oldInvoicesDialog.assistanceButton') }}
        </PButton>
        <PButton
          pType="primary"
          pTag="a"
          target="_blank"
          :href="loginUrl"
          pTestId="old-rydge-invoices-login-button"
          @click="emit('login-click')"
        >
          {{ t('entities.seresInvoices.oldInvoicesDialog.loginButton') }}
        </PButton>
      </div>
    </div>
  </PDialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PButton, PDialog, PImage } from '@pulse/styleguide/components'
import { useDialogAccessibleTitle } from '@pulse/styleguide'
import type { OldRydgeInvoicesDialogEmits, OldRydgeInvoicesDialogProps } from './old-rydge-invoices-dialog.types'

defineProps<OldRydgeInvoicesDialogProps>()
const emit = defineEmits<OldRydgeInvoicesDialogEmits>()

const isOpen = defineModel<boolean>({ default: false })

const { t } = useI18n()

const plainTitle = useDialogAccessibleTitle(
  t,
  'entities.seresInvoices.oldInvoicesDialog.title',
  'entities.seresInvoices.oldInvoicesDialog.titleHighlight',
)
</script>

<style scoped lang="scss">
.old-rydge-invoices-dialog {
  &__logo {
    width: 130px;
  }
}
</style>
