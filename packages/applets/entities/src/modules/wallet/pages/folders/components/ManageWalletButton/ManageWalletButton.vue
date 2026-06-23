<template>
  <PToolboxButton
    :pElements="toolboxItems"
    :pType="buttonType"
    pSize="small"
    pElementsTestId="manage-wallet-menu"
    data-testid="manage-wallet-button"
    @p-item-clicked="onItemClicked"
  >
    <span>{{ buttonLabel }}</span>
    <PPastille
      v-if="hasSelection"
      pType="default"
      pSize="small"
      class="margin-left--3 text-color--base-blue-pulse"
      data-testid="manage-wallet-count"
    >
      {{ selectedFoldersCount }}
    </PPastille>
  </PToolboxButton>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PPastille, PToolboxButton } from '@pulse/styleguide/components'
import type { PButtonProps } from '@pulse/styleguide/types'
import { ManageWalletAction } from '@entities/modules/wallet/enums'
import { ManageWalletMenuManager } from './manage-wallet-menu.manager'
import type { ManageWalletButtonProps, ManageWalletMenuTranslations } from './manage-wallet-button.types'

const props = defineProps<ManageWalletButtonProps>()

const emit = defineEmits<{
  'action-selected': [action: ManageWalletAction]
}>()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      manageWallet: 'Manage my portfolio | Manage this folder | Manage these folders',
      delegateWallet: 'Delegate my portfolio',
      delegateFolders: 'Delegate the folder | Delegate the folders',
      viewPermanentDelegations: 'View my permanent delegations',
      requestDelegation: 'Request a delegation',
      pendingDelegations: 'Pending delegation(s)',
      createTestAccount: 'Create a test account',
    },
    'fr-FR': {
      manageWallet: 'Gérer mon portefeuille | Gérer ce dossier | Gérer ces dossiers',
      delegateWallet: 'Déléguer mon portefeuille',
      delegateFolders: 'Déléguer le dossier | Déléguer les dossiers',
      viewPermanentDelegations: 'Voir mes délégations permanentes',
      requestDelegation: 'Demander une délégation',
      pendingDelegations: 'Délégation(s) en attente',
      createTestAccount: 'Créer un compte de test',
    },
  },
})

const hasSelection = computed(() => props.selectedFoldersCount > 0)

const buttonType = computed<PButtonProps['pType']>(() => (hasSelection.value ? 'active' : 'secondary'))

const buttonLabel = computed(() => t('manageWallet', props.selectedFoldersCount))

const menuTranslations = computed<ManageWalletMenuTranslations>(() => ({
  delegateWallet: t('delegateWallet'),
  delegateFolders: t('delegateFolders', props.selectedFoldersCount),
  viewPermanentDelegations: t('viewPermanentDelegations'),
  requestDelegation: t('requestDelegation'),
  pendingDelegations: t('pendingDelegations'),
  createTestAccount: t('createTestAccount'),
}))

const toolboxItems = computed(() =>
  ManageWalletMenuManager.getMenuElements(props.selectedFoldersCount, menuTranslations.value),
)

const onItemClicked = (action: ManageWalletAction) => {
  emit('action-selected', action)
}
</script>
