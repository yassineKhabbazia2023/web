<template>
  <PButton
    pTestId="create-agent-lock-button"
    pType="primary"
    pSize="small"
    :pDisabled="isLoading"
    @click="handleOpenDialog"
  >
    <PIcon
      pName="lock"
      pSize="16"
      class="el-button__icon--left"
    />
    Créer un lock
  </PButton>

  <CreateAgentLockDialog
    v-if="isDialogOpened"
    v-model="isDialogOpened"
    :environments
    @lock-created="handleLockCreated"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PButton, PIcon } from '@pulse/styleguide/components'
import type { AgentLockEnvironmentItem } from '@backoffice/types/agents-dashboard.type'
import CreateAgentLockDialog from './create-agent-lock-dialog/create-agent-lock-dialog.vue'

defineProps<{
  isLoading: boolean
  environments: AgentLockEnvironmentItem[]
}>()

const emit = defineEmits<{
  'lock-created': []
}>()

const isDialogOpened = ref(false)

const handleOpenDialog = (): void => {
  isDialogOpened.value = true
}

const handleLockCreated = (): void => {
  emit('lock-created')
}
</script>
