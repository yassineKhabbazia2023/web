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
import AddAppSettingDialog from './AddAppSettingDialog/add-app-setting-dialog.vue'

const emit = defineEmits<{
  'refresh-list': []
}>()

const isAddDialogOpened = ref(false)

const handleOpenDialog = () => {
  isAddDialogOpened.value = true
}

const handleAppSettingCreated = () => {
  emit('refresh-list')
}
</script>
