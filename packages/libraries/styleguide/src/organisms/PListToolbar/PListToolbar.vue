<template>
  <div class="p-list-toolbar bg--base-white shadow--2 overflow-hidden" :data-testid="pTestId ?? 'p-list-toolbar'">
    <div
      class="
        p-list-toolbar__header
        flex
        flex--wrap
        flex--align-items-center
        flex--justify-content-space-between
        flex-gap--3
        flex-row-gap--3
        padding-x--4
        padding-y--3
      "
    >
      <div class="p-list-toolbar__search flex--grow-1">
        <slot name="search" />
      </div>
      <div
        v-if="hasActions"
        class="
          flex
          flex--wrap
          flex--align-items-center
          flex-gap--2
        "
      >
        <PDivider
          class="margin-right--2"
          pDirection="vertical"
          pBorderColor="gray-200"
        />
        <slot name="actions" />
      </div>
    </div>
    <div
      v-if="pHasResultsBar"
      :class="[
        'p-list-toolbar__results',
        'flex',
        'flex--align-items-center',
        'flex--justify-content-space-between',
        'flex-gap--6',
        'height--12',
        'padding-x--4',
        'text-color--black-rock-900',
        hasSelection ? 'bg--jungle-75' : '',
      ]"
    >
      <div class="flex flex--align-items-center flex-gap--2">
        <slot name="summary" />
        <PDivider
          pDirection="vertical"
          pBorderColor="gray-200"
        />
        <PButton
          pType="default"
          pSize="small"
          data-testid="p-list-toolbar__filter-button"
          @click="emit('open-filters')"
        >
          <PIcon pName="sliders" />
          <span class="padding-left--2">{{ pFilterLabel }}</span>
          <Transition name="fade">
            <PPastille
              v-if="hasFilterCount"
              pType="dark-green"
              pSize="small"
              class="margin-left--2"
              data-testid="p-list-toolbar__filter-count"
            >
              {{ pFilterCount }}
            </PPastille>
          </Transition>
        </PButton>
        <template v-if="hasFilterCount">
          <PDivider
            pDirection="vertical"
            pBorderColor="gray-200"
          />
          <PButton
            class="
              font-semibold
              text-color--jungle-500
            "
            pType="default"
            pSize="small"
            data-testid="p-list-toolbar__reset-button"
            @click="emit('clear-filters')"
          >
            <span>{{ pResetLabel }}</span>
          </PButton>
        </template>
      </div>
      <div
        v-if="hasSelection"
        class="flex flex--align-items-center flex-gap--6"
      >
        <slot name="selection" />
        <PButton
          class="
            font-semibold
            padding--0
            text-color--jungle-500
          "
          pType="default"
          pSize="small"
          data-testid="p-list-toolbar__deselect-button"
          @click="emit('clear-selection')"
        >
          <span>{{ pDeselectLabel }}</span>
          <span class="font-bold margin-left--3">X</span>
        </PButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, useSlots } from 'vue'
import PButton from '../../atoms/PButton'
import PDivider from '../../atoms/PDivider'
import PIcon from '../../atoms/PIcon'
import PPastille from '../../atoms/PPastille'
import type { PListToolbarProps, PListToolbarEmits } from './PListToolbar.types'

const props = withDefaults(defineProps<PListToolbarProps>(), {
  pFilterCount: 0,
  pSelectedCount: 0,
  pHasResultsBar: true,
})

const emit = defineEmits<PListToolbarEmits>()

const slots = useSlots()

const hasActions = computed(() => slots.actions !== undefined)
const hasSelection = computed(() => props.pSelectedCount > 0)
const hasFilterCount = computed(() => props.pFilterCount > 0)
</script>

<style lang="scss" scoped>
.p-list-toolbar {
  border-radius: var(--el-border-radius-base);

  &__results {
    border-top: 1px solid var(--p-gray-100);
  }
}
</style>
