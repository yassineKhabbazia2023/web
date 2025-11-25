<template>
  <PDialog
    v-model="isDialogOpened"
    data-testid="add-app-setting-dialog"
    pTitle="Ajouter une variable d'environnement"
    pWidth="700px"
    pAlignCenter
  >
    <PAlert
      pType="info"
      class="margin-bottom--5"
    >
      Créez une nouvelle variable de configuration pour un ou plusieurs environnements.
    </PAlert>

    <PForm
      ref="formRef"
      :pModel="form"
      pLabelPosition="top"
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
          data-testid="add-app-setting-name-input"
          pPlaceholder="Domain_acc_account_Config__ApiKey"
        />
      </PFormItem>

      <PFormItem
        pLabel="Valeur"
        prop="value"
        pRequired
        :pError="errors.value"
        class="margin-bottom--5"
      >
        <PInput
          id="value-input"
          v-model="form.value"
          data-testid="add-app-setting-value-input"
          pPlaceholder="https://api.example.com/..."
        />
      </PFormItem>
    </PForm>

    <div class="background-color--neutral-gray-50 border-radius--2 margin-bottom--5">
      <div class="flex flex--align-items-center flex--justify-content-space-between margin-bottom--">
        <div>
          <p class="font-small font-semibold text-color--neutral-gray-900 margin--0">
            Variable secrète
          </p>
          <p class="font-small text-color--neutral-gray-600 margin--0 margin-top--1">
            Les valeurs seront masquées dans l'interface
          </p>
        </div>
        <PSwitch
          v-model="form.isSecret"
          data-testid="add-app-setting-is-secret-switch"
          pSize="small"
        />
      </div>

      <div class="border-top--1 border-color--neutral-gray-200 padding-top--3">
        <div class="flex flex--align-items-center flex--justify-content-space-between">
          <div>
            <p class="font-small font-semibold text-color--neutral-gray-900 margin--0">
              Appliquer à tous les environnements
            </p>
            <p class="font-small text-color--neutral-gray-600 margin--0 margin-top--1">
              Tous les environnements et labels disponibles
            </p>
          </div>
          <PSwitch
            v-model="form.allEnvs"
            data-testid="add-app-setting-all-envs-switch"
            pSize="small"
          />
        </div>
      </div>

      <div
        v-if="form.allEnvs === true"
        class="border-top--1 border-color--neutral-gray-200 padding-top--3"
      >
        <div class="flex flex--align-items-center flex--justify-content-space-between">
          <div>
            <p class="font-small font-semibold text-color--neutral-gray-900 margin--0">
              Inclure les labels
            </p>
            <p class="font-small text-color--neutral-gray-600 margin--0 margin-top--1">
              Applique également à tous les labels de chaque environnement
            </p>
          </div>
          <PSwitch
            v-model="form.withLabels"
            data-testid="add-app-setting-with-labels-switch"
            pSize="small"
          />
        </div>
      </div>
    </div>

    <div v-if="form.allEnvs === false">
      <p class="font-small font-semibold text-color--neutral-gray-900 margin--0 margin-y--3">
        Sélectionner les environnements cibles
      </p>

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

      <div
        v-else
        class="bg--neutral-gray-50 border-radius--2 padding-x--4 padding-y--2"
      >
        <EnvironmentHierarchicalSelector
          v-model="form.selectedEnvironments"
          :availableEnvironments="availableEnvironments"
          :disabled="isCreating"
        />
      </div>

      <p
        v-if="errors.selectedEnvironments"
        class="font-small text-color--danger-500 margin--0 margin-top--2"
      >
        {{ errors.selectedEnvironments }}
      </p>
    </div>

    <template #footer>
      <div class="p-dialog__footer">
        <PButton
          data-testid="add-app-setting-cancel-button"
          pType="secondary"
          pSize="small"
          :pDisabled="isCreating"
          @click="handleClose"
        >
          Annuler
        </PButton>
        <PButton
          data-testid="add-app-setting-create-button"
          pType="primary"
          pSize="small"
          :pDisabled="!isFormValid"
          :pLoading="isCreating"
          @click="handleCreate"
        >
          <PIcon
            pName="add"
            pSize="16"
            class="el-button__icon--left"
          />
          Créer la variable
        </PButton>
      </div>
    </template>
  </PDialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  PButton,
  PDialog,
  PInput,
  PSwitch,
  PIcon,
  PForm,
  PFormItem,
  PAlert,
  PLoader,
} from '@pulse/styleguide/components'
import type { FormInstance } from '@pulse/styleguide/types'
import EnvironmentHierarchicalSelector from '@backoffice/components/EnvironmentHierarchicalSelector/environment-hierarchical-selector.vue'
import type { AddAppSettingDialogProps } from './add-app-setting-dialog.type'
import { useAddAppSettingDialog } from './add-app-setting-dialog.composable'

defineProps<AddAppSettingDialogProps>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'app-setting-created': []
}>()

const isDialogOpened = defineModel<boolean>({ default: false })
const formRef = ref<FormInstance>()

const {
  form,
  availableEnvironments,
  isLoadingEnvironments,
  hasEnvironmentLoadError,
  isCreating,
  errors,
  isFormValid,
  handleClose: closeDialog,
  handleCreate: createAppSetting,
  loadAvailableEnvironments,
} = useAddAppSettingDialog({
  onSuccess: () => {
    emit('app-setting-created')
  },
  onClose: () => {
    isDialogOpened.value = false
  },
})

function handleClose(): void {
  closeDialog()
}

async function handleCreate(): Promise<void> {
  await createAppSetting()
}

onMounted(() => {
  loadAvailableEnvironments()
})
</script>
