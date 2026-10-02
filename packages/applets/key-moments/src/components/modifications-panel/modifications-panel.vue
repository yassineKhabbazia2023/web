<template>
  <PPopover
    v-if="modifications.length > 0"
    pTrigger="click"
    pPlacement="bottom-end"
    :pTitle="t('keyMoments.publish.restore.title')"
    :pWidth="POPOVER_WIDTH"
    pTestId="key-moments-modifications-popover"
  >
    <template #content>
      <ul
        class="list-style-none"
        data-testid="key-moments-modifications-list"
      >
        <li
          v-for="modification in modifications"
          :key="modification.kind"
          class="
            key-moments-modifications__row
            padding-y--1
            padding-x--2
            font-small
            text-color--text-heading
          "
        >
          {{ modification.label }}
        </li>
      </ul>
      <div
        class="
          flex
          flex--justify-content-flex-end
          margin-top--2
        "
      >
        <PButton
          pSize="small"
          pType="tertiary"
          pTestId="key-moments-restore-published-button"
          @click="emit('restore')"
        >
          {{ t('keyMoments.publish.restore.button') }}
        </PButton>
      </div>
    </template>
    <button
      type="button"
      class="
        key-moments-modifications__button
        padding--0
        font-small
        font-bold
        text-color--text-heading
        cursor-pointer
      "
      data-testid="key-moments-modifications-button"
    >
      {{ label }}
    </button>
  </PPopover>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PButton, PPopover } from '@pulse/styleguide/components'
import type { ModificationRow } from '../../pages/key-moments/publish-state.types'

const POPOVER_WIDTH = 380

const props = defineProps<{
  modifications: ModificationRow[]
}>()

const emit = defineEmits<{
  restore: []
}>()

const { t } = useI18n()

const label = computed(() => t(
  'keyMoments.publish.state.modified',
  { count: props.modifications.length },
  props.modifications.length,
))
</script>

<style scoped lang="scss">
.key-moments-modifications {
  &__row {
    white-space: normal;

    &:nth-child(odd) {
      background-color: var(--p-surface-neutral-lighter);
    }
  }

  // Styled as the line it replaces, only hinting on hover that it opens something
  &__button {
    background: none;
    border: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
