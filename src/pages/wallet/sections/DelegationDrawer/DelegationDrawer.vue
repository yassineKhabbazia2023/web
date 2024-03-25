<template>
  <PDrawer class="delegation-drawer" v-model="isDelegationDrawerOpened">
    <template #header-prefix>
      <h3 class="delegation-drawer__header">
        <template v-if="flowType === DelegationFlowType.FULL">
          {{  t('walletDelegation') }}
        </template>
        <template v-else>
          {{  t('folderDelegation', selectedFolders.length) }}
        </template>
      </h3>
    </template>

    <PSteps
      v-if="flowType === DelegationFlowType.FULL"
      class="margin-bottom--6"
      :pActive="activeStep"
      pFinishStatus="success"
    >
      <PStep :title="t('addColaborator')" />
      <PStep :title="t('automaticDelegation')" />
    </PSteps>

    <!-- v-if step one component -->
    <!-- v-else step one component -->
    <CollapsableFoldersList
      v-if="flowType === DelegationFlowType.SPECIFIC"
      :folders="selectedFolders"
    />

    <template #footer>
      <NextPreviousButtons
        :previousLabel="previousButtonLabel"
        :nextLabel="nextButtonLabel"
        @click-previous="handlePreviousClick"
        @click-next="handleNextClick"
      />
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDrawer, PSteps, PStep } from '@kpmg/styleguide'
import { type DelegationDrawerProps, DelegationFlowType } from './DelegationDrawerTypes'
import CollapsableFoldersList from './components/CollapsableFoldersList'
import NextPreviousButtons from '@/components/NextPreviousButtons'

const props = defineProps<DelegationDrawerProps>()
const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const activeStep = ref<number>(0)

const isDelegationDrawerOpened = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const flowType = computed(() => props.selectedFolders.length
  ? DelegationFlowType.SPECIFIC
  : DelegationFlowType.FULL,
)

const previousButtonLabel = computed(() => activeStep.value ? t('previousButtonLabel') : t('cancelButtonLabel'))
const nextButtonLabel = computed(() => activeStep.value === 2 ? t('submitButtonLabel') : t('nextButtonLabel'))

function handlePreviousClick() {
  activeStep.value--
}

function handleNextClick() {
  activeStep.value++
}
</script>

<i18n lang="yaml">
  en-US:
    walletDelegation: 'Delegate a wallet'
    folderDelegation: 'Delegate a folder | Delegate multiple folders'
    addColaborator: 'Add a colaborator'
    automaticDelegation: 'Automatic delegation'
    cancelButtonLabel: 'Cancel'
    previousButtonLabel: 'Cancel'
    nextButtonLabel: 'Next'
    submitButtonLabel: 'Submit'
  fr-FR:
    walletDelegation: 'Déléguer un portefeuille'
    folderDelegation: 'Déléguer un dossier | Déléguer plusieurs dossiers'
    addColaborator: 'Ajout des collaborateurs'
    automaticDelegation: 'Délégation automatique'
    cancelButtonLabel: 'Annuler'
    previousButtonLabel: 'Précedent'
    nextButtonLabel: 'Suivant'
    submitButtonLabel: 'Valider'

</i18n>
