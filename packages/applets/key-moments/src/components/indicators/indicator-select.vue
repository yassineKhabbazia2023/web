<template>
  <div
    class="
      flex
      flex--align-items-center
      flex-gap--1
    "
  >
    <PDropdown
      v-model="model"
      class="flex--grow-1"
      :pOptions="options"
      :pPlaceholder="t('keyMoments.settings.indicatorSelect.placeholder')"
      :pNoMatchText="t('keyMoments.settings.indicatorSelect.noMatch')"
      pSize="small"
      pFilterable
      pClearable
      :pTestId="testId"
    />

    <!--
      Beside the list rather than inside it: a dropdown carries options, not
      actions. The term created lands on this very line.
    -->
    <PTooltip
      v-if="canCreate === true && createIndicator !== undefined"
      :pContent="t('keyMoments.settings.indicatorSelect.create')"
    >
      <PButton
        pSize="small"
        pIconOnly
        pType="tertiary"
        :pTestId="`${testId}-create-button`"
        @click="createIndicator(selectIndicator)"
      >
        <PIcon pName="plusLg" />
      </PButton>
    </PTooltip>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { PButton, PDropdown, PIcon, PTooltip } from '@pulse/styleguide/components'
import { INDICATOR_CREATION_KEY } from './indicator-creation.consts'
import type { Indicator } from '../../types/key-moments.types'

const props = withDefaults(defineProps<{
  vocabulary: Indicator[]
  testId: string
  /**
   * Whether a missing term may be created from here. Off inside the creation
   * drawer itself: the button would reopen the drawer it sits in, and empty it.
   */
  canCreate?: boolean
}>(), {
  canCreate: true,
})

const model = defineModel<string>()

const { t } = useI18n()

/** Absent where nothing mounts a creation drawer; the button is then not offered */
const createIndicator = inject(INDICATOR_CREATION_KEY, undefined)

function selectIndicator(code: string): void {
  model.value = code
}

/**
 * Named by label and code alike: the code is what the document carries, so an
 * author picking a term has to see the one they are writing.
 */
const options = computed(() => props.vocabulary
  .map(indicator => ({
    pValue: indicator.id,
    pLabel: indicator.isDeprecated === true
      ? t('keyMoments.settings.indicatorSelect.deprecatedOption', { label: indicator.label, code: indicator.id })
      : t('keyMoments.settings.indicatorSelect.option', { label: indicator.label, code: indicator.id }),
  })))
</script>
