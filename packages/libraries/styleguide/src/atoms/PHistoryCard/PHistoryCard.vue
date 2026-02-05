<template>
  <div
    class="p-history-card
      flex
      flex--align-item-center
      flex--justify-content-space-between
      padding-left--5 padding-right--2 padding-y--3
      bg--base-white
      shadow--2"
    :class="{ 'p-history-card--clickable': isClickable }"
    @click="handleCardClick"
  >
    <div class="p-history-card__content">
      <ul class="p-history-card__list-tags flex flex--align-items-center list-style-none">
        <li v-if="pDate !== undefined" class="p-history-card__list-item">
          <PTag
            pSize="small"
            :pColor="dateColor"
            :pContent="pDate"
            data-testid="history-card-date"
          />
        </li>
        <li v-if="pTime !== undefined" class="p-history-card__list-item">
          <PTag
            pSize="small"
            pColor="lighter-gray"
            :pContent="pTime"
            data-testid="history-card-time"
          />
        </li>
        <li v-if="pType !== undefined" class="p-history-card__list-item">
          <PTag
            pSize="small"
            pColor="lighter-gray"
            :pContent="pType"
            data-testid="history-card-type"
          />
        </li>
        <li v-if="pDescription !== undefined" class="p-history-card__list-item">
          <PTag
            pSize="small"
            pColor="lighter-gray"
            :pContent="pDescription"
            data-testid="history-card-description"
          />
        </li>
        <li v-if="pEntity !== undefined" class="p-history-card__list-item">
          <PTooltip
            v-if="pTooltipEntityContent !== undefined"
            :pContent="pTooltipEntityContent"
            pPlacement="bottom"
            data-testid="history-card-entity-tooltip"
          >
            <PTag
              pSize="small"
              pColor="lighter-gray"
              :pIconLeftName="pEntityIconName"
              :pContent="pEntity"
              data-testid="history-card-entity"
            />
          </PTooltip>
          <PTag
            v-else
            pSize="small"
            pColor="lighter-gray"
            :pIconLeftName="pEntityIconName"
            :pContent="pEntity"
            data-testid="history-card-entity"
          />
        </li>
      </ul>
      <p v-if="$slots.text !== undefined" class="p-history-card__text margin-top--2 font-normal font-base">
        <slot name="text" />
      </p>
      <PAccordion
        v-if="pHasAccordion === true && $slots.details !== undefined"
        :pIsOpen="isAccordionOpen"
        :pHasHeader="false"
      >
        <div class="p-history-card__details margin-top--3" data-testid="history-card-details">
          <slot name="details" />
        </div>
      </PAccordion>
    </div>
    <div class="p-history-card__actions flex flex--align-items-center">
      <div
        v-if="$slots.action !== undefined"
        class="p-history-card__action margin-left--3"
        @click.stop
      >
        <slot name="action" />
      </div>
      <PIcon
        v-if="pHasAccordion === true && $slots.details !== undefined"
        :pName="isAccordionOpen ? 'chevronUp' : 'chevronDown'"
        class="p-history-card__chevron cursor-pointer margin-left--3"
        data-testid="history-card-chevron"
        @click.stop="handleCardClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, useSlots, computed } from 'vue'
import type { PHistoryCardProps } from './PHistoryCardTypes'
import PTag from '../PTag'
import PTooltip from '../PTooltip'
import PIcon from '../PIcon'
import PAccordion from '../PAccordion'

const props = defineProps<PHistoryCardProps>()

const slots = useSlots()

const isAccordionOpen = ref(false)

const isClickable = computed(() => props.pHasAccordion === true && slots.details !== undefined)

const dateColor = computed(() => props.pDateColor ?? 'dark-blue')

function handleCardClick() {
  if (isClickable.value === true) {
    isAccordionOpen.value = !isAccordionOpen.value
  }
}
</script>

<style lang="scss" scoped>
.p-history-card {
  $self: &;

  min-height: 70px;

  &--clickable {
    cursor: pointer;
  }

  &__list-item {
    & + #{$self}__list-item {
      margin-left: 0.8rem;
    }
  }

  &__text {
    white-space: wrap;
  }

  &__details {
    padding-top: 0.8rem;
    border-top: 1px solid var(--color-base-neutral-200);
  }
}
</style>
