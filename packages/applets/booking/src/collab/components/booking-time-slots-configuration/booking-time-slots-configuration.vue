<template>
  <div
    class="
      flex
      flex--direction-column
      flex-gap--6
    "
  >
    <p class="color-gray-700">
      {{ t('booking-time-slots-configuration.description') }}
    </p>

    <PAlert
      pType="information"
      class="margin-top--2"
    >
      <span>
        <strong>{{ t('booking-time-slots-configuration.tipLabel') }}</strong>
        {{ ' ' + t('booking-time-slots-configuration.tip') }}
      </span>
    </PAlert>

    <div
      class="
        flex
        flex--direction-column
        flex-gap--6
        margin-top--2
      "
    >
      <div
        v-for="day in daysOfWeek"
        :key="day"
        class="flex flex--direction-column"
      >
        <div class="flex flex--align-items-center">
          <span
            class="
              booking-time-slots__day-label
              font-bold
              text-color--neutral-gray-900
            "
          >
            {{ t(`booking-time-slots-configuration.days.${day}`) }}
          </span>

          <div
            class="
              flex
              flex--direction-column
              flex-gap--2
            "
          >
            <div
              v-if="getDaySlotsCount(day) === 0"
              class="
                flex
                flex--align-items-center
                flex-gap--3
              "
            >
              <PButton
                pType="secondary"
                pPlain
                pSize="small"
                @click="addDaySlots(day)"
              >
                <PIcon
                  pName="plusLg"
                  pSize="14px"
                  class="margin-right--2"
                />
                {{ t('booking-time-slots-configuration.addDay') }}
              </PButton>
            </div>

            <TransitionGroup name="slot-fade">
              <div
                v-for="(slot, index) in getSlotsByDay(day)"
                :key="`${day}-${index}`"
                class="
                  flex
                  flex--align-items-center
                  flex-gap--2
                "
              >
                <PDropdown
                  v-model="slot.start"
                  :pOptions="timeOptions"
                  :pPlaceholder="t('booking-time-slots-configuration.startTime')"
                  class="booking-time-slots__dropdown"
                />
                <PDropdown
                  v-model="slot.end"
                  :pOptions="timeOptions"
                  :pPlaceholder="t('booking-time-slots-configuration.endTime')"
                  class="booking-time-slots__dropdown"
                />
                <PIcon
                  pName="trash"
                  pSize="16px"
                  class="margin-left--2 cursor-pointer"
                  @click="removeSlot(getSlotIndex(slot))"
                />
                <PIcon
                  pName="plusLg"
                  pSize="16px"
                  pColor="var(--p-green-600)"
                  class="cursor-pointer"
                  @click="addSingleSlot(day)"
                />
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="#booking-drawer__footer">
      <div class="margin-left--auto">
        <PButton
          pType="secondary"
          pPlain
          class="margin-right--4"
          @click="emit('previous-step')"
        >
          {{ t('booking-configuration.buttons.previous') }}
        </PButton>

        <PButton
          pType="primary"
          @click="emit('next-step')"
        >
          {{ t('booking-configuration.buttons.next') }}
        </PButton>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { PAlert, PButton, PDropdown, PIcon } from '@pulse/styleguide/components'
import type { TimeSlotsConfiguration } from './booking-time-slots-configuration.types'
import { useBookingTimeSlotsConfiguration } from './booking-time-slots-configuration.composable'

const timeSlotsFormData = defineModel<TimeSlotsConfiguration>({ required: true })

const emit = defineEmits<{
  'next-step': []
  'previous-step': []
}>()

const { t } = useI18n({ useScope: 'global' })

const {
  daysOfWeek,
  timeOptions,
  getSlotsByDay,
  getDaySlotsCount,
  getSlotIndex,
  addSingleSlot,
  addDaySlots,
  removeSlot,
} = useBookingTimeSlotsConfiguration(timeSlotsFormData)
</script>

<style lang="scss" scoped>
.booking-time-slots {
  &__day-label {
    min-width: calc(65px + 16px);
    font-size: 16px;
  }

  &__dropdown {
    width: 120px;
  }
}

.slot-fade-enter-active {
  transition: all 0.3s ease;
}

.slot-fade-leave-active {
  transition: all 0.2s ease;
}

.slot-fade-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.slot-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.slot-fade-move {
  transition: transform 0.3s ease;
}
</style>
