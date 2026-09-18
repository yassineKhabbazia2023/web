<template>
  <PPopover
    v-if="modifications.length > 0"
    pTrigger="click"
    pPlacement="bottom-end"
    :pTitle="t('keyMoments.publish.revert.title')"
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
            flex
            flex--align-items-center
            flex--justify-content-space-between
            flex-gap--2
            padding-y--1
            padding-x--2
          "
          :title="modification.hint"
        >
          <span class="font-small text-color--text-heading">
            {{ modification.label }}
          </span>
          <PButton
            v-if="modification.isRevertible"
            pSize="small"
            pType="tertiary"
            :pLoading="revertingKind === modification.kind"
            :pTestId="`key-moments-revert-${modification.kind}-button`"
            @click="emit('revert', modification)"
          >
            {{ t('keyMoments.publish.revert.button') }}
          </PButton>
          <span
            v-else
            class="font-small text-color--text-neutral"
          >
            {{ t('keyMoments.publish.revert.unavailable') }}
          </span>
        </li>
      </ul>
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
import { DivergenceKind } from '../../enums/key-moments.enums'
import type { ModificationRow } from '../../pages/key-moments/publish-state.types'

const POPOVER_WIDTH = 380

const props = withDefaults(defineProps<{
  modifications: ModificationRow[]
  revertingKind?: DivergenceKind
}>(), {
  revertingKind: undefined,
})

const emit = defineEmits<{
  revert: [modification: ModificationRow]
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
