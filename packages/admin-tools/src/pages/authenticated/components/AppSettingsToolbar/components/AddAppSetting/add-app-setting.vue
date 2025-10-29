<template>
  <PButton
    data-testid="add-app-setting-button"
    pType="primary"
    pSize="small"
    class="margin-left--4"
    @click="handleOpenDialog"
  >
    <PIcon
      pName="add"
      pSize="16"
      class="el-button__icon--left"
    />
    Ajouter une variable
  </PButton>

  <AddAppSettingDialog
    v-if="isAddDialogOpened"
    v-model="isAddDialogOpened"
    @app-setting-created="handleAppSettingCreated"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PButton, PIcon } from '@pulse/styleguide/components'
import { logger } from '@pulse/toolbox'
import AddAppSettingDialog from './components/AddAppSettingDialog/add-app-setting-dialog.vue'
import type { AddAppSettingFormData } from './components/AddAppSettingDialog/add-app-setting-dialog.type'

const isAddDialogOpened = ref(false)

const handleOpenDialog = () => {
  isAddDialogOpened.value = true
}

const handleAppSettingCreated = (data: AddAppSettingFormData) => {
  // TODO: Implement API call to create environment variable
  logger.info('Environment variable created:', data)
  // Future implementation will call AppSettingsListService.createAppSetting(data)
  // and refresh the list
}
</script>
