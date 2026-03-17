<template>
  <PCollapse>
    <PCollapseItem
      pType="gray"
      :pTitleCollapseItem="t('selectedFolders')"
    >
      <slot />
    </PCollapseItem>
  </PCollapse>
</template>

<script setup lang="ts">
import {
  PCollapse,
  PCollapseItem,
} from '@pulse/styleguide/components'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      selectedFolders: 'Selected Folders',
    },
    'fr-FR': {
      selectedFolders: 'Dossiers sélectionnés',
    },
  },
})
</script>

