<template>
  <div :class="cardClasses">
    <div
      class="
        flex
        flex--direction-column
        flex--align-items-center
        flex--justify-content-center
        padding-x--4
      "
    >
      <span :class="dateTimeClasses">
        {{ formattedDate }}
      </span>
      <span :class="dateTimeClasses">
        {{ formattedTime }}
      </span>
    </div>

    <div class="flex--grow-1">
      <span class="font-semibold">
        {{ pLabel }}
      </span>
    </div>

    <button
      v-if="pIsOnlineMeeting"
      type="button"
      :disabled="isJoinDisabled"
      class="
        p-appointment-card__join
        flex
        flex--align-items-center
        flex-gap--2
        font-semibold
        font-small
        padding--0
        cursor-pointer
      "
      @click="emit('join')"
    >
      <span>{{ pJoinLabel }}</span>
      <PIcon
        pName="cameraVideo"
        pSize="18px"
      />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { formatShortDate, formatTime } from '@pulse/toolbox/utils/dates'
import PIcon from '../../atoms/PIcon'
import type { PAppointmentCardProps } from './PAppointmentCardTypes'

const props = withDefaults(defineProps<PAppointmentCardProps>(), {
  pIsOnlineMeeting: false,
  pJoinLabel: 'Rejoindre',
  pIsActive: true,
})

const emit = defineEmits<{
  join: []
}>()

const cardClasses = computed(() => [
  'p-appointment-card',
  'flex',
  'flex--align-items-center',
  'flex--justify-content-space-between',
  'padding-y--3',
  'padding-right--4',
  'bg--white',
  { 'p-appointment-card--active': props.pIsActive },
])

const dateTimeClasses = computed(() => [
  'font-small',
  'font-semibold',
  props.pIsActive ? 'text-color--jungle-400' : 'text-color--neutral-gray-400',
])

const isJoinDisabled = computed(() => props.pIsActive === false)

const formattedDate = computed(() => formatShortDate(props.pStartDateTime))

const formattedTime = computed(() => formatTime(props.pStartDateTime))
</script>

<style lang="scss" scoped>
.p-appointment-card {
  height: 56px;
  border: none;
  border-left: 4px solid var(--p-gray-300);

  &--active {
    border-left-color: var(--p-jungle-400);
  }

  &__join {
    background: none;
    border: none;
    color: var(--p-jungle-400);

    &:disabled {
      cursor: not-allowed;
      color: var(--p-gray-400);
    }
  }
}
</style>
