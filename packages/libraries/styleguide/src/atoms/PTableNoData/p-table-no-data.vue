<template>
  <div
    class="
      flex
      flex--align-items-center
      flex--justify-content-center
      flex--direction-column
      flex-gap--4
      bg--gray-50
      padding--8
      text-color--text-neutral
      margin-top--2
    "
  >
    <div class="flex flex--align-items-center flex-gap--2">
      <PIcon :pName="pIconName" pSize="16" />
      {{ pEmptyText ?? t('styleguide.table.emptyText') }}
    </div>

    <PButton
      v-if="isNotNullNorEmpty(pActionLabel)"
      pType="primary"
      @click="$emit('action-click')"
    >
      {{ pActionLabel }}
    </PButton>
  </div>
</template>

<script lang="ts" setup>
import { isNotNullNorEmpty } from '@pulse/toolbox'
import { useI18n } from 'vue-i18n'
import type { PTableNoDataProps } from './p-table-no-data.types'
import PIcon from '../PIcon/PIcon.vue'
import PButton from '../PButton/PButton.vue'

defineEmits<{
  (e: 'action-click'): void
}>()

withDefaults(
  defineProps<PTableNoDataProps>(),
  {
    pIconName: 'infoCircle',
  },
)

const { t } = useI18n()
</script>
