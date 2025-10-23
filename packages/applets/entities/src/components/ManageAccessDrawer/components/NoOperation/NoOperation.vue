<template>
  <div
    class="
      flex
      flex--align-items-center
      height--100
    "
  >
    <ul
      class="
        list-style-none
        width--100
        text-center
      "
    >
      <li class="text-color--base-blue-pulse">
        <PIcon
          pName="stars"
          pSize="32"
        />
      </li>
      <li
        class="
          margin-top--4
          font-large
          text-color--base-blue-pulse
        "
      >
        {{ t('title') }}
      </li>
      <li
        class="
          margin-top--2
          text-color--neutral-gray-500
        "
      >
        {{ t('description') }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { PIcon } from '@pulse/styleguide/components'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})
</script>

<i18n lang="yaml">
    en-US:
      title: 'You have managed all access requests'
      description: 'You will be notified when you have new access requests.'
    fr-FR:
      title: 'Vous avez géré toutes les demandes d’accès'
      description: 'Vous serez notifié.e quand vous aurez de nouvelles demandes d’accès'
</i18n>
