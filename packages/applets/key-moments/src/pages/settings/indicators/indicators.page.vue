<template>
  <div data-testid="key-moments-settings-indicators-page">
    <div
      class="
        flex
        flex--align-items-center
        flex-gap--4
        margin-bottom--4
      "
    >
      <PInput
        v-model="searchText"
        class="key-moments-indicators__search"
        pSize="small"
        pClearable
        pPrefixIconName="search"
        :pPlaceholder="t('keyMoments.settings.indicators.search')"
        pTestId="key-moments-settings-indicators-search-input"
      />

      <label
        class="
          flex
          flex--align-items-center
          flex-gap--2
        "
      >
        <PSwitch
          v-model="showDeprecated"
          :pLabel="t('keyMoments.settings.indicators.showDeprecated')"
          pTestId="key-moments-settings-indicators-deprecated-switch"
        />
        <span>{{ t('keyMoments.settings.indicators.showDeprecated') }}</span>
      </label>

      <span class="text-color--text-neutral-neutral">
        {{ t('keyMoments.settings.indicators.count', { count: visibleIndicators.length }) }}
      </span>

      <PButton
        class="margin-left--auto"
        pSize="small"
        pType="primary"
        pTestId="key-moments-settings-indicators-create-button"
        @click="drawer?.openCreate()"
      >
        {{ t('keyMoments.settings.indicators.create') }}
      </PButton>
    </div>

    <div
      v-if="isLoading"
      class="
        flex
        flex--justify-content-center
        margin-top--8
      "
      data-testid="key-moments-settings-indicators-loader"
    >
      <PLoader
        pType="primary"
        pSize="50"
      />
    </div>

    <IndicatorsTable
      v-else
      :indicators="visibleIndicators"
      @edit="openEdit"
      @deprecate="code => askTransition(code, 'deprecate')"
      @restore="code => askTransition(code, 'restore')"
    />

    <PConfirmationPopup
      pAppendToBody
      :pIsVisible="pendingTransition !== undefined"
      :pTitle="transitionTitle"
      :pConfirmButtonContent="t('keyMoments.settings.indicators.confirm')"
      :pCancelButtonContent="t('keyMoments.settings.indicators.cancel')"
      pTestId="key-moments-settings-indicators-transition-popup"
      @on-confirm-button-click="applyTransition"
      @on-cancel-button-click="cancelTransition"
    >
      <p>{{ transitionMessage }}</p>
    </PConfirmationPopup>

    <IndicatorDrawer
      ref="drawer"
      :vocabulary="indicators"
      @saved="load"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PButton,
  PConfirmationPopup,
  PInput,
  PLoader,
  PSwitch,
} from '@pulse/styleguide/components'
import IndicatorDrawer from '@key-moments/components/indicators/indicator-drawer/indicator-drawer.vue'
import IndicatorsTable from '@key-moments/components/indicators/indicators-table.vue'
import { useIndicators } from './indicators.composable'
import type { IndicatorTransition } from './indicators.types'

const { t } = useI18n()

const {
  indicators,
  visibleIndicators,
  isLoading,
  searchText,
  showDeprecated,
  load,
  deprecate,
  restore,
} = useIndicators()

const drawer = useTemplateRef<InstanceType<typeof IndicatorDrawer>>('drawer')
const pendingTransition = ref<IndicatorTransition>()

const transitionTitle = computed(() => (pendingTransition.value?.action === 'deprecate'
  ? t('keyMoments.settings.indicators.deprecate')
  : t('keyMoments.settings.indicators.restore')))

// Deprecating never erases: templates already citing the term keep reading it
const transitionMessage = computed(() => {
  const transition = pendingTransition.value

  if (transition === undefined) {
    return ''
  }

  const usageCount = indicators.value
    .filter(indicator => (indicator.components ?? [])
      .some(component => component.indicator === transition.code))
    .length

  return transition.action === 'deprecate'
    ? t('keyMoments.settings.indicators.confirmDeprecate', { code: transition.code, count: usageCount })
    : t('keyMoments.settings.indicators.confirmRestore', { code: transition.code })
})

function openEdit(code: string): void {
  const indicator = indicators.value.find(candidate => candidate.id === code)

  if (indicator !== undefined) {
    drawer.value?.openEdit(indicator)
  }
}

function askTransition(code: string, action: IndicatorTransition['action']): void {
  pendingTransition.value = { code, action }
}

function cancelTransition(): void {
  pendingTransition.value = undefined
}

async function applyTransition(): Promise<void> {
  const transition = pendingTransition.value

  if (transition === undefined) {
    return
  }

  pendingTransition.value = undefined
  await (transition.action === 'deprecate' ? deprecate(transition.code) : restore(transition.code))
}
</script>

<style scoped lang="scss">
.key-moments-indicators {

  &__search {
    width: 320px;
  }
}
</style>
