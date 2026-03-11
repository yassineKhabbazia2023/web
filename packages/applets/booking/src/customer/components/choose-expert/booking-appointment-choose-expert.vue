<template>
  <PLoader v-if="isLoading" />
  <template v-else>
    <p class="margin-top--10">
      {{ t('booking-appointment-choose-expert.description') }}
    </p>
    <ul
      class="
        list-style-none
        booking-expert-list
        flag--gap-4
        margin-top--4
      "
    >
      <li
        v-for="expert in formattedExperts"
        :key="expert.id"
        class="
          flex
          flex--direction-column
          flex--align-items-center
          padding--4
          cursor-pointer
          hover-bg--tranquil-50
        "
        @click="emit('update:selected-expert-id', expert.id)"
      >
        <PAvatar
          :pRole="AvatarRoles.COLLAB"
          class="margin-bottom--2"
        >
          {{ expert.initials }}
        </PAvatar>
        <span class="font-semibold text-center">{{ expert.fullName }}</span>
      </li>
    </ul>
  </template>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PAvatar, PLoader } from '@pulse/styleguide/components'
import type { BookingAppointmentChooseExpertProps } from './booking-appointment-choose-expert.type'
import { AvatarRoles } from '@pulse/styleguide'
import { getFormattedExperts } from './booking-appointment-choose-expert.utils'

const { t } = useI18n({ useScope: 'global' })

const props = defineProps<BookingAppointmentChooseExpertProps>()

const emit = defineEmits<{
  'update:selected-expert-id': [number]
}>()

const formattedExperts = computed(() => getFormattedExperts(props.experts))
</script>

<style scoped>
.booking-expert-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
}
</style>

  <i18n lang="yaml">
    en-US:
      close: 'Close'
      tabs:
        choose-expert: 'Choose an expert'
        choose-time-slot: 'Choose a time slot'
    fr-FR:
      close: 'Fermer'
      tabs:
        choose-expert: 'Choisissez un expert'
        choose-time-slot: 'Choisissez un créneau'
  </i18n>
