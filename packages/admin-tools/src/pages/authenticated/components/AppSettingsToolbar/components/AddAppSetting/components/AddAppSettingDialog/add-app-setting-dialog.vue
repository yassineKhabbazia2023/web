<template>
  <PDialog
    v-model="isDialogOpened"
    data-testid="add-app-setting-dialog"
    pTitle="Ajouter une variable d'environnement"
    pWidth="700px"
    pAlignCenter
  >
    <div
      class="background-color--info-50 border-radius--2 border-left--4 border-color--info-500 margin-bottom--5"
    >
      <p class="font-small text-color--info-700 margin--0">
        Créez une nouvelle variable de configuration pour un ou plusieurs environnements.
      </p>
    </div>

    <PForm
      ref="formRef"
      :pModel="form"
      pLabelPosition="top"
      pRequireAsteriskPosition="right"
    >
      <div>
        <div class="flex flex-gap--6 margin-bottom--2">
          <div class="width--50">
            <PFormItem
              pLabel="Clé de la variable"
              prop="key"
              pRequired
              :pError="errors.key"
            >
              <PInput
                id="key-input"
                v-model="form.key"
                data-testid="add-app-setting-key-input"
                pPlaceholder="Domain_acc_account_BrokerSetting__ManagedIdentityClientId"
              />
            </PFormItem>
          </div>

          <div class="width--50">
            <PFormItem
              pLabel="Domaine"
              prop="domain"
              pRequired
              :pError="errors.domain"
            >
              <PDropdown
                id="domain-dropdown"
                v-model="form.domain"
                data-testid="add-app-setting-domain-dropdown"
                pPlaceholder="Sélectionner un domaine"
                :pOptions="domainOptions"
                :pLoading="isLoadingDomains"
              />
            </PFormItem>
          </div>
        </div>

        <div class="flex flex-gap--6">
          <div class="width--50">
            <PFormItem
              pLabel="Environnement"
              prop="environment"
              pRequired
              :pError="errors.environment"
            >
              <PDropdown
                id="environment-dropdown"
                v-model="form.environment"
                data-testid="add-app-setting-environment-dropdown"
                pPlaceholder="Sélectionner un environnement"
                :pOptions="ENVIRONMENT_OPTIONS"
                :disabled="form.createForAllEnvironments"
              />
              <p
                v-if="form.createForAllEnvironments"
                data-testid="add-app-setting-all-envs-message"
                class="font-small text-color--info-600 margin--0 margin-top--1"
              >
                Tous les environnements sélectionnés
              </p>
            </PFormItem>
          </div>

          <div class="width--50">
            <PFormItem
              pLabel="Label"
              prop="label"
            >
              <PInput
                id="label-input"
                v-model="form.label"
                data-testid="add-app-setting-label-input"
                pPlaceholder="Auto-rempli"
                pDisabled
              />
              <p class="font-small text-color--neutral-gray-500 margin--0 margin-top--1">
                Identique à l'environnement
              </p>
            </PFormItem>
          </div>
        </div>
      </div>

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

      <PFormItem
        pLabel="Tags (optionnel)"
        prop="tags"
        class="margin-bottom--5"
      >
        <PInput
          id="tags-input"
          v-model="form.tags"
          data-testid="add-app-setting-tags-input"
          pPlaceholder="team:backend,critical:true"
        />
        <p class="font-small text-color--neutral-gray-500 margin--0 margin-top--1">
          Format: clé:valeur,clé2:valeur2
        </p>
      </PFormItem>
    </PForm>

    <div class="background-color--neutral-gray-50 border-radius--2 padding--4">
      <div class="flex flex--align-items-center flex--justify-content-space-between margin-bottom--3">
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
              Créer pour tous les environnements
            </p>
            <p class="font-small text-color--neutral-gray-600 margin--0 margin-top--1">
              DEV, ITG, REC, PPR et PRD
            </p>
          </div>
          <PSwitch
            v-model="form.createForAllEnvironments"
            data-testid="add-app-setting-create-all-envs-switch"
            pSize="small"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="p-dialog__footer">
        <PButton
          data-testid="add-app-setting-cancel-button"
          pType="secondary"
          pSize="small"
          @click="handleClose"
        >
          Annuler
        </PButton>
        <PButton
          data-testid="add-app-setting-create-button"
          pType="primary"
          pSize="small"
          :pDisabled="!isFormValid"
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
import { ref, computed, watch, onMounted } from 'vue'
import { PButton, PDialog, PInput, PDropdown, PSwitch, PIcon, PForm, PFormItem } from '@pulse/styleguide/components'
import type { FormInstance } from '@pulse/styleguide/types'
import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import { AppSettingsListService } from '@admin-tools/services/app-settings-list/app-settings-list.service'
import { ENVIRONMENT_LABELS, AVAILABLE_ENVIRONMENTS } from '@admin-tools/constants/admin-tool.const'
import type {
  AddAppSettingDialogProps,
  AddAppSettingFormData,
  ValidationErrors,
} from './add-app-setting-dialog.type'

defineProps<AddAppSettingDialogProps>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'app-setting-created': [data: AddAppSettingFormData]
}>()

const ENVIRONMENT_OPTIONS = Object.entries(ENVIRONMENT_LABELS).map(([value, label]) => ({
  pValue: value,
  pLabel: label,
}))

const createInitialFormState = () => ({
  key: '',
  environment: '',
  domain: '',
  label: '',
  value: '',
  tags: '',
  isSecret: false,
  createForAllEnvironments: false,
})

const isDialogOpened = defineModel<boolean>({ default: false })
const formRef = ref<FormInstance>()
const form = ref(createInitialFormState())
const domainOptions = ref<Array<{ pValue: string; pLabel: string }>>([])
const isLoadingDomains = ref(false)
const errors = ref<ValidationErrors>({})

const isFormValid = computed(() => {
  const hasKey = form.value.key.trim().length > 0
  const hasDomain = form.value.domain.trim().length > 0
  const hasValue = form.value.value.trim().length > 0
  const hasEnvironment =
    form.value.createForAllEnvironments === true ||
    form.value.environment.trim().length > 0

  return hasKey === true && hasDomain === true && hasValue === true && hasEnvironment === true
})

watch(
  () => form.value.environment,
  (newEnvironment) => {
    if (newEnvironment !== '') {
      form.value.label = newEnvironment
    }
  },
)

watch(
  () => form.value.createForAllEnvironments,
  (shouldCreateForAll) => {
    if (shouldCreateForAll === true) {
      form.value.environment = ''
      form.value.label = ''
    }
  },
)

const validateForm = (): boolean => {
  errors.value = {}

  if (form.value.key.trim().length === 0) {
    errors.value.key = 'La clé est requise'
  }

  if (form.value.domain.trim().length === 0) {
    errors.value.domain = 'Le domaine est requis'
  }

  if (form.value.value.trim().length === 0) {
    errors.value.value = 'La valeur est requise'
  }

  if (
    form.value.createForAllEnvironments === false &&
    form.value.environment.trim().length === 0
  ) {
    errors.value.environment = "L'environnement est requis"
  }

  return Object.keys(errors.value).length === 0
}

const buildApiPayload = (): AddAppSettingFormData => {
  const type = form.value.isSecret === true ? 'Secret' : 'String'
  const environments =
    form.value.createForAllEnvironments === true
      ? [...AVAILABLE_ENVIRONMENTS]
      : [form.value.environment]

  const values = environments.map((env) => ({
    environment: env,
    label: env,
    envLabel: env,
    value: form.value.value,
    eTag: '',
  }))

  return {
    key: form.value.key,
    type,
    domain: form.value.domain,
    values,
  }
}

const resetForm = () => {
  form.value = createInitialFormState()
  errors.value = {}
}

const handleClose = () => {
  isDialogOpened.value = false
  resetForm()
}

const handleCreate = () => {
  if (validateForm() === false) {
    return
  }

  const payload = buildApiPayload()

  logger.info('Create environment variable:', payload)

  emit('app-setting-created', payload)
  isDialogOpened.value = false
  resetForm()
}

const loadDomains = async () => {
  isLoadingDomains.value = true

  try {
    const domains = await AppSettingsListService.getDomains()
    domainOptions.value = domains.map((domain) => ({
      pValue: domain.domainName,
      pLabel: `${domain.domainName} (${domain.keysCount})`,
    }))
  } catch (error) {
    logger.error('Failed to load domains:', error)
    displayNotification('error', 'Impossible de charger les domaines')
    domainOptions.value = []
  } finally {
    isLoadingDomains.value = false
  }
}

onMounted(() => {
  loadDomains()
})
</script>
