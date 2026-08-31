<template>
  <PDialog
    v-model="isVisible"
    :pTitle="t('widgets.invoicesSereniteDialog.title')"
    pWidth="640px"
    :pFullscreen="isMobile"
    :pCloseOnClickModal="false"
    :pCloseOnPressEscape="false"
    pShowClose
    pAlignCenter
    pTestId="invoices-serenite-dialog"
    class="invoices-serenite-dialog"
    @update:model-value="emit('close')"
  >
    <div class="flex flex--direction-column flex-gap--4">
      <p class="font-base">
        {{ t('widgets.invoicesSereniteDialog.intro') }}
      </p>

      <section
        class="
          bg--surface-information-primary
          flex
          flex--direction-column
          flex-gap--4
          padding-x--4
          padding-y--3
        "
      >
        <h3 class="font-large font-bold">
          {{ t('widgets.invoicesSereniteDialog.offer.titlePart1') }}
          <span class="text-color--jungle-400">{{ t('widgets.invoicesSereniteDialog.offer.titleHighlight') }}</span>
        </h3>

        <div class="flex flex--direction-column flex-gap--2 font-base">
          <p>{{ t('widgets.invoicesSereniteDialog.offer.descriptionPart1') }}</p>
          <p>{{ t('widgets.invoicesSereniteDialog.offer.descriptionPart2') }}</p>
        </div>

        <div class="flex flex--align-items-center flex--justify-content-space-between flex-gap--3">
          <div class="flex flex--align-items-center flex-gap--3">
            <PTag
              pColor="dark-blue"
              pSize="small"
              pIconLeftName="link45deg"
              :pContent="t('widgets.invoicesSereniteDialog.offer.tagIntegration')"
            />
            <PTag
              pColor="dark-blue"
              pIconLeftName="calendarEvent"
              :pContent="t('widgets.invoicesSereniteDialog.offer.tagNoCommitment')"
            />
          </div>
          <p class="text-right">
            <span class="font-large font-bold">{{ t('widgets.invoicesSereniteDialog.offer.price') }}</span>
            <span class="font-small margin-left--1">{{ t('widgets.invoicesSereniteDialog.offer.priceUnit') }}</span>
          </p>
        </div>
      </section>

      <PAlert
        pType="warning"
        pIconName="exclamationTriangle"
        class="font-base"
      >
        {{ t('widgets.invoicesSereniteDialog.legalWarning') }}
      </PAlert>
    </div>

    <template #footer>
      <div class="flex flex--align-items-center flex--justify-content-flex-end flex-gap--3">
        <PButton
          pType="secondary"
          pTestId="invoices-serenite-understand-reform-button"
          @click="emit('understand-reform')"
        >
          {{ t('widgets.invoicesSereniteDialog.understandReformButton') }}
        </PButton>
        <PButton
          pType="primary"
          pTestId="invoices-serenite-comply-button"
          @click="emit('comply')"
        >
          {{ t('widgets.invoicesSereniteDialog.complyButton') }}
        </PButton>
      </div>
    </template>
  </PDialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useResponsive } from '@pulse/styleguide'
import { PDialog, PButton, PAlert, PTag } from '@pulse/styleguide/components'
const emit = defineEmits<{
  'comply': []
  'understand-reform': []
  'close': []
}>()

const isVisible = defineModel<boolean>({ required: true })

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

const { isMobile } = useResponsive()
</script>
