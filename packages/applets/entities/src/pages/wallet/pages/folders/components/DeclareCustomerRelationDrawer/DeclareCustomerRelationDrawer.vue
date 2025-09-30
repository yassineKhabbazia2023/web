<template>
  <PDrawer
    v-model="isDeclareCustomerRelationDrawerOpened"
    pSize="50%"
    :pTitle="t('declareCustomerRelationship')"
    @close-drawer-button="handleCloseDrawer"
    @close="handleCloseDrawer"
  >
    <PUserCard
      class="margin-bottom--6"
      pColor="gray"
      pImageName="folder-open-duotone"
      :pTitle="selectedAccount?.name"
      :pSubtitle="selectedAccount?.accountNumber"
      data-testid="declare-customer-relation-entity-card"
    >
      <PTag
        pSize="default"
        pColor="gray"
        pIconLeftName="building"
        :pContent="t('entity')"
      />
    </PUserCard>
    <section aria-labelledby="relation-switch-label">
      <p class="font-bold">
        {{ t('declareStatus') }}
      </p>
      <div class="flex flex--align-items-center margin-top--3">
        <PSwitch
          v-model="hasCustomerRelationStatus"
          :pActiveColor="AppColors.PRIMARY"
          aria-labelledby="relation-switch-label"
          data-testid="declare-customer-relation-switch"
        />
        <div class="flex flex--direction-column margin-left--3">
          <h4
            id="relation-switch-label"
            class="h4 font-bold margin-bottom--1"
          >
            {{ t('inClientRelationship') }}
          </h4>
          <p> {{ t('clientRelationshipInfo') }} </p>
        </div>
      </div>
    </section>
    <template #footer>
      <DrawerActionButtons
        cancelTestId="declare-customer-relation-reset-button"
        submitTestId="declare-customer-relation-submit-button"
        :loading="isLoading"
        :cancelDisabled="isLoading"
        :submitDisabled="hasCustomerRelationStatusNotChanged"
        @close-drawer="handleCloseDrawer"
        @submit-action="handleUpdateCustomerRelation"
      />
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { logger } from '@pulse/core'
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { AppColors, displayNotification } from '@pulse/styleguide'
import { PDrawer, PUserCard, PSwitch, PTag } from '@pulse/styleguide/components'
import { DeclareCustomerRelationDrawerProps } from './DeclareCustomerRelationDrawer.types'
import { updateCustomerRelation } from '@entities/services/account'
import { useUserStore } from '@pulse/common/stores'
import DrawerActionButtons from '@entities/common/components/DrawerActionButtons/DrawerActionButtons.vue'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})
const userStore = useUserStore()

const props = defineProps<DeclareCustomerRelationDrawerProps>()
const emit = defineEmits<{
  'update-account-table': []
}>()

const isLoading = ref(false)

// #region Declare Customer Relation Drawer actions
const hasCustomerRelationStatus = ref(false)
const isDeclareCustomerRelationDrawerOpened = defineModel<boolean>({ default: false })
const hasCustomerRelationStatusNotChanged = computed(() => props.isCustomerRelation === hasCustomerRelationStatus.value)

const handleCloseDrawer = () => {
  isDeclareCustomerRelationDrawerOpened.value = false
}

const handleUpdateCustomerRelation = async () => {
  isLoading.value = true
  try {
    if (userStore.user?.id) {
      await updateCustomerRelation(props.selectedAccount.accountId, userStore.user?.id, hasCustomerRelationStatus.value)
    }
    displayNotification('success', t('customerRelationUpdated'))
    emit('update-account-table')
  } catch {
    displayNotification('error', t('customerRelationUpdateFail'))
    logger.trace('Relation Client - Failed to update customer relation. Please try again.')
  } finally {
    isLoading.value = false
  }
}
// #endregion

onMounted(() => {
  hasCustomerRelationStatus.value = props.isCustomerRelation
})
</script>

<i18n lang="yaml">
  en-US:
    cancel: 'Cancel'
    submit: 'Submit'
    entity: 'Entity'
    declareStatus: 'Declare if you are'
    customerRelationUpdated: 'Customer relation was successfully updated.'
    customerRelationUpdateFail: 'Failed to update customer relation. Please try again.'
    inClientRelationship: 'In client relationship'
    declareCustomerRelationship: 'Declare customer relationship on the entity'
    clientRelationshipInfo: >
      By declaring yourself as involved in the client relationship, you make it easier to connect with your client.
      You will be visible in the client portal, and the client will recognize you as their point of contact.
  fr-FR:
    cancel: 'Annuler'
    submit: 'Valider'
    entity: 'Entité'
    declareStatus: 'Déclarez si vous êtes'
    customerRelationUpdated: 'La relation client a été mise à jour avec succès.'
    customerRelationUpdateFail: 'Échec de la mise à jour de la relation client. Veuillez réessayer.'
    inClientRelationship: 'En relation client'
    declareCustomerRelationship: 'Se déclarer en relation client sur le dossier'
    clientRelationshipInfo: >
      En vous déclarant en relation client vous facilitez la relation entre vous et votre client.
      En effet vous serez visible sur l'espace client et le client vous identifiera comme interlocuteur à contacter.
</i18n>
