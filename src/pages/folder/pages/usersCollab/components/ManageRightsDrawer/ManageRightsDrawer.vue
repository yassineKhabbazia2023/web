<template>
  <PDrawer
    v-model="internalModel"
    :pTitle="t('modifyUserRights')"
    pSize="50%"
    @close-drawer-button="internalModel = false"
  >
    <PUserCard
      :pTitle="userInfo.fullName"
      :pSubtitle="userInfo.email"
      pAssetLeft="Image"
      pAssetContent="user-male"
      pColor="gray"
      class="margin-bottom--6"
      data-testid="manage-rights-user-info"
    >
      <PTag
        pColor="gray-900"
        pSize="default"
        pIconLeft="PIPerson"
        :pContent="userInfo.role"
        pEffect="light"
      />
    </PUserCard>
    <p class="margin-bottom--6" data-testid="manage-rights-info">
      {{ t('info') }}
    </p>
  </PDrawer>
</template>

<script setup lang="ts">
import { PDrawer, PUserCard, PTag } from '@kpmg/styleguide'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ManageRightsDrawerProps } from './ManageRightsTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<ManageRightsDrawerProps>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

const internalModel = computed({
  get() {
    return props.modelValue
  },
  set(val: boolean) {
    emit('update:modelValue', val)
  },
})
</script>

<i18n lang="yaml">
en-US:
  modifyUserRights: 'Modify user rights'
  info: 'Activate or deactivate the features you want to give for this user.'
fr-FR:
  modifyUserRights: 'Modifier les droits utilisateur'
  info: 'Activez ou désactivez les fonctionnalités que vous souhaitez donner pour cet utilisateur.'
</i18n>
