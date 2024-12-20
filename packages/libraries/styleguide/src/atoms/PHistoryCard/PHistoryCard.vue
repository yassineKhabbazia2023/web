<template>
  <div
    class="p-history-card
      flex
      flex--align-item-center
      flex--justify-content-space-between
      padding-left--5 padding-right--2 padding-y--3
      shadow--2
      radius--1
      bg--base-white"
  >
    <div class="p-history-card__content">
      <ul class="p-history-card__list-tags flex flex--align-items-center list-style-none">
        <li v-if="pDate" class="p-history-card__list-item">
          <PTag
            pSize="small"
            pColor="persian"
            pPlain
            pEffect="dark"
            :pContent="pDate"
            data-testid="history-card-date"
          />
        </li>
        <li v-if="pType" class="p-history-card__list-item">
          <PTag
            pSize="small"
            pColor="gray-500"
            pEffect="light"
            :pContent="pType"
            data-testid="history-card-type"
          />
        </li>
        <li v-if="pEntity" class="p-history-card__list-item">
          <PTooltip
            v-if="pTooltipEntityContent"
            :pContent="pTooltipEntityContent"
            pPlacement="bottom"
            data-testid="history-card-entity-tooltip"
          >
            <PTag
              pSize="small"
              pColor="gray-500"
              pEffect="light"
              :pIconLeftName="pEntityIconName"
              :pContent="pEntity"
              data-testid="history-card-entity"
            />
          </PTooltip>
          <PTag
            v-else
            pSize="small"
            pColor="gray-500"
            pEffect="light"
            :pIconLeftName="pEntityIconName"
            :pContent="pEntity"
            data-testid="history-card-entity"
          />
        </li>
      </ul>
      <p v-if="$slots.text" class="p-history-card__text margin-top--2 font-normal font-base">
        <slot name="text" />
      </p>
    </div>
    <div v-if="$slots.action" class="p-history-card__action margin-left--3">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PHistoryCardProps } from './PHistoryCardTypes'
import PTag from '../PTag'
import PTooltip from '../PTooltip'

defineProps<PHistoryCardProps>()
</script>

<style lang="scss" scoped>
.p-history-card {
  $self: &;

  min-height: 70px;

  &__list-item {
    & + #{$self}__list-item {
      margin-left: 0.8rem;
    }
  }

  &__text {
    white-space: wrap;
  }
}
</style>
