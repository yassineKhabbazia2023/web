<template>
  <PDialog
    v-model="isDialogOpened"
    data-testid="modify-app-setting-dialog"
    pTitle="Modifier une variable d'environnement"
    pWidth="700px"
    pAlignCenter
  >
    <PAlert pType="info" class="margin-bottom--5">
      Modifiez les valeurs existantes par environnement/label.
    </PAlert>


    <div
      v-if="isLoadingEnvironments"
      class="flex flex--justify-content-center padding--6"
    >
      <PLoader />
    </div>

    <PAlert
      v-else-if="hasEnvironmentLoadError"
      pType="error"
      class="margin-bottom--3"
    >
      Impossible de charger les environnements disponibles
    </PAlert>

    <div v-else>
      <PForm
        ref="formRef"
        :pModel="form"
        pRequireAsteriskPosition="right"
      >
        <PFormItem
          pLabel="Nom de la variable"
          prop="name"
          pRequired
          :pError="errors.name"
          class="margin-bottom--4"
        >
          <PInput
            id="name-input"
            v-model="form.name"
            data-testid="modify-app-setting-name-input"
            :pDisabled="true"
          />
        </PFormItem>
      </PForm>

      <div>
        <p class="font-small font-semibold text-color--neutral-gray-900 margin--0 margin-y--3">
          Modifier les valeurs par environnement
        </p>

        <div class="bg--neutral-gray-50 border-radius--2 padding-x--4 padding-y--2">
          <EnvironmentValueEditor
            v-model="form.valuesByTarget"
            :availableEnvironments="availableEnvironments"
            :disabled="isSaving"
          />
        </div>

        <p
          v-if="errors.valuesByTarget"
          class="font-small text-color--danger-500 margin--0 margin-top--2"
        >
          {{ errors.valuesByTarget }}
        </p>
      </div>
    </div>

    <template #footer>
      <div class="p-dialog__footer">
        <PButton
          data-testid="modify-app-setting-cancel-button"
          pType="secondary"
          pSize="small"
          :pDisabled="isSaving"
          @click="handleClose"
        >
          Annuler
        </PButton>
        <PButton
          data-testid="modify-app-setting-save-button"
          pType="primary"
          pSize="small"
          :pDisabled="isSaveDisabled"
          :pLoading="isSaving"
          @click="handleSave"
        >
          <PIcon
            pName="check"
            pSize="16"
            class="el-button__icon--left"
          />
          Enregistrer
        </PButton>
      </div>
    </template>
  </PDialog>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import {
  PButton,
  PDialog,
  PInput,
  PIcon,
  PForm,
  PFormItem,
  PAlert,
  PLoader,
} from '@pulse/styleguide/components'
import type { FormInstance } from '@pulse/styleguide/types'
import EnvironmentValueEditor from '@backoffice/components/EnvironmentValueEditor/environment-value-editor.vue'
import type { ModifyAppSettingProps } from './modify-app-setting.type'
import { useModifyAppSetting } from './modify-app-setting.composable'

const props = defineProps<ModifyAppSettingProps>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'app-setting-updated': []
}>()

const isDialogOpened = defineModel<boolean>({ default: false })
const formRef = ref<FormInstance>()

const {
  form,
  availableEnvironments,
  isLoadingEnvironments,
  hasEnvironmentLoadError,
  isSaving,
  errors,
  isFormValid,
  hasTargetsToSave,
  hasClearedValue,
  initializeFromItem,
  handleClose: closeDialog,
  handleSave: saveAppSetting,
  loadAvailableEnvironments,
} = useModifyAppSetting({
  onSuccess: () => emit('app-setting-updated'),
  onClose: () => {
    isDialogOpened.value = false
  },
})

const isSaveDisabled = computed(() => (
  isFormValid.value === false
  || hasTargetsToSave.value === false
  || hasClearedValue.value === true
))

function handleClose(): void {
  closeDialog()
}

async function handleSave(): Promise<void> {
  await saveAppSetting()
}

onMounted(async () => {
  await loadAvailableEnvironments()
})

watch(
  () => props.appSetting,
  (item) => {
    if (item) {
      initializeFromItem(item)
    }
  },
  { immediate: true },
)
</script>
