<template>
  <div>
    <div
      class="
        flex
        flex--justify-content-end
        margin-bottom--6
      "
    >
      <PButton
        v-if="isCollab"
        pType="secondary"
        pSize="small"
        @click="openProspectCreationDrawer"
      >
        <PIcon class="el-button__icon--left" pName="plusLg" />
        {{ t('addProspect') }}
      </PButton>
    </div>
    <ProspectCreationDrawer
      v-if="isProspectCreationDrawerOpened"
      v-model="isProspectCreationDrawerOpened"
      @submit="onProspectCreationSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { PButton, PIcon } from '@pulse/styleguide/components'
import { useUserStore } from '@pulse/common/stores'
import { logger } from '@pulse/toolbox'
import ProspectCreationDrawer from './components/prospect-creation-drawer'
import type { ProspectFormData } from './components/prospect-creation-drawer/prospect-creation-drawer.type'

const userStore = useUserStore()
const { isCollab } = storeToRefs(userStore)

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      addProspect: 'Add a prospect',
    },
    'fr-FR': {
      addProspect: 'Ajouter un prospect',
    },
  },
})

const isProspectCreationDrawerOpened = ref(false)

function openProspectCreationDrawer() {
  isProspectCreationDrawerOpened.value = true
}

function onProspectCreationSubmit(formData: ProspectFormData) {
  logger.trace('Prospect form data:', formData)
}
</script>
