<template>
  <ul
    class="
      list-style-none
      flex
      flex--wrap
      flag--gap-4
    "
  >
    <li
      v-for="expert in formattedExperts"
      :key="expert.contactId"
      class="
        flex
        flex--direction-column
        flex--align-items-center
        padding--4
        cursor-pointer
        hover-bg--tranquil-50
      "
      @click="emit('update:selected-expert-id', expert.contactId)"
    >
      <PAvatar
        :pRole="AvatarRoles.COLLAB"
        class="margin-bottom--2"
      >
        {{ expert.initials }}
      </PAvatar>
      {{ expert.fullName }}
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { PAvatar } from '@pulse/styleguide/components'
import type { BookingAppointmentChooseExpertProps } from './booking-appointment-choose-expert.type'
import { AvatarRoles } from '@pulse/styleguide'
import { getFormattedExperts } from './booking-appointment-choose-expert.utils'

const props = defineProps<BookingAppointmentChooseExpertProps>()

const emit = defineEmits<{
  'update:selected-expert-id': [number]
}>()

const formattedExperts = computed(() => getFormattedExperts(props.experts))
</script>

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
