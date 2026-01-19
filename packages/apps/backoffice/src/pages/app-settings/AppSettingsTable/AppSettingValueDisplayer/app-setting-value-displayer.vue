<template>
  <div data-testid="app-setting-value-displayer" class="app-setting-value-displayer flex flex--direction-column">
    <div class="flex flex--align-items-center">
      <p class="font-semibold font-small flex flex--align-items-center">
        <PTooltip
          v-if="value === ''"
          pContent="Cette valeur est manquante (valeur nulle). Veuillez vérifier ou renseigner l'information."
          pPlacement="top"
        >
          <PIcon
            data-testid="app-setting-value-missing-icon"
            pName="exclamationTriangle"
            :color="AppColors.RED_500"
            class="margin-right--2"
          />
        </PTooltip>
        <PTooltip
          v-else-if="incoherent"
          :pContent="incoherent"
          pPlacement="top"
        >
          <PIcon
            data-testid="app-setting-value-incoherent-icon"
            pName="exclamationTriangle"
            :color="AppColors.ORANGE_500"
            class="margin-right--2"
          />
        </PTooltip>
        <PButton
          v-if="shouldShowValue"
          data-testid="app-setting-value-copy-button"
          class="padding--0"
          @click="copyValue"
        >
          <PTooltip
            :pContent="appSettingValue"
            :disabled="isSecret && !displayValue"
            pPlacement="top"
          >
            <p class="app-setting-value-displayer__value padding-y--2">
              {{ appSettingValue }}
            </p>
          </PTooltip>
        </PButton>
        <span v-else class="font-light text-color--neutral-gray-400">-</span>
      </p>
      <PButton
        v-if="shouldShowValue && isSecret"
        pSize="small"
        pIconOnly
        data-testid="app-setting-value-toggle-visibility"
        @click="displayValue = !displayValue"
      >
        <PIcon
          :pName="displayValue ? 'eyeSlash' : 'eye'"
          pSize="14"
        />
      </PButton>
    </div>
    <p data-testid="app-setting-value-timestamp" class="text-color--neutral-gray-400 font-light font-small">
      {{ formattedDate }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PIcon, PButton, PTooltip } from '@pulse/styleguide/components'
import { AppColors, displayNotification } from '@pulse/styleguide'
import { logger } from '@pulse/toolbox'
import type { AppSettingValueDisplayerProps } from './app-setting-value-displayer.type'

const props = defineProps<AppSettingValueDisplayerProps>()

const displayValue = ref(false)

const shouldShowValue = computed(() => {
  return props.value !== ''
})

const isSecret = computed(() => props.type === 'secret')

const appSettingValue = computed(() => {
  if (props.value === '') {
    return '-'
  }

  if (props.type === 'string') {
    return props.value
  }

  return displayValue.value ? props.value : '●'.repeat(8)
})

const formattedDate = computed(() => {
  if (props.lastModified === '') {
    return 'Non renseigné'
  }

  const date = new Date(props.lastModified)
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})

const copyValue = async () => {
  if (isSecret.value === true && displayValue.value === false) {
    return
  }

  try {
    await navigator.clipboard.writeText(props.value)
    displayNotification('success', 'Valeur copiée avec succès')
  } catch (error) {
    logger.error('Failed to copy value to clipboard:', error)
    displayNotification('error', 'Impossible de copier la valeur')
  }
}
</script>

<style lang="scss" scoped>
.app-setting-value-displayer {
  &__value {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  }
}
</style>
