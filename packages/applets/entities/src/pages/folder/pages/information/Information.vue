<template>
  <div class="margin-top--6">
    <PAlert
      v-if="isCollab"
      id="folder-information-alert"
      data-testid="folder-information-alert"
    >
      {{ t('alertInstruction') }}
    </PAlert>
    <div
      v-if="isLoading"
      class="loader flex flex--justify-content-center flex--align-items-center"
      data-testid="folder-information-loader"
    >
      <PLoader pType="primary" pSize="50" />
    </div>
    <PForm
      v-else
      :pModel="currentAccount"
      pLabelPosition="top"
      class="folder-information__form margin-top--6"
      aria-describedby="folder-information-alert"
      data-testid="folder-information-form"
    >
      <section
        v-for="(section, index) in informationFormStructure"
        :key="`section-${index}`"
        class="folder-information__form-section
        shadow--3 radius--1 padding-x--5
        padding-bottom--1 margin-bottom--6"
      >
        <p
          class="folder-information__form-section-title font-bold padding-top--5 margin-bottom--3"
        >
          <span
            v-if="section.sectionKey === 'companyAddress'"
            data-testid="folder-information-form-address-section"
          >
            {{ addressSectionTitle }}
          </span>
          <span v-else>
            {{ section.title }}
          </span>
        </p>
        <PFieldSet
          :pModel="currentAccount"
          :pFields="section.fields"
          class="folder-information__form-section-fields"
          @update:p-model="onInputAccount"
        />
      </section>
      <div
        v-if="canEdit"
        class="flex flex--justify-content-flex-end"
      >
        <PButton
          class="margin-right--4"
          pType="primary"
          pSize="small"
          data-testid="information-save-button"
          :pDisabled="patchValues.length === 0"
          :pLoading="isSaving"
          @click="onClickSave"
        >
          {{ t('save') }}
        </PButton>
      </div>
    </PForm>
  </div>
</template>

<script setup lang="ts">
import { logger } from '@pulse/core'
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { commonStore } from '@pulse/common'
import { PButton, PAlert, PForm, PFieldSet, PLoader } from '@pulse/styleguide/components'
import { fetchAccount, type Account } from '@entities/services/account'
import type { FormSection } from '@entities/pages/entities/components/CompanyInformation/CompanyInformationTypes'
import { getFormStructure } from '@entities/common/utils/referential'
import { getCanEdit, savePatchedAccount } from './InformationHelper'
import { cloneDeep, get, setWith } from 'lodash-es'
import { addPathValue } from '@entities/services/PatchRecordService/PatchRecordService'
import { type PatchValue } from '@entities/services/PatchRecordService'
import { displayNotification } from '@entities/common/utils/helpers'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const route = useRoute()
const isLoading = ref<boolean>(true)
const { isCollab } = storeToRefs(commonStore())
const currentAccount = ref<Account | undefined>(undefined)
const originalAccount = ref<Account | undefined>(undefined)
const informationFormStructure = ref<FormSection[]>()

const addressSectionTitle = computed(() =>
  currentAccount.value?.address?.[0].addressType === 'billing'
    ? t('billing')
    : t('delivery'),
)

const canEdit = ref(false)
const isSaving = ref(false)
const patchValues = ref<PatchValue[]>([])
const accountId = parseInt(`${route.params.id}`)

function onInputAccount(fieldKey: string, value: any) {
  const previousValue = get(originalAccount.value, fieldKey)
  addPathValue(patchValues.value, fieldKey, previousValue, value)
  if (currentAccount.value) {
    setWith(currentAccount.value, fieldKey, value, Object)
  }
}

async function onClickSave() {
  try {
    isSaving.value = true
    await savePatchedAccount(accountId, patchValues.value)
    displayNotification('success', t('save-succeeded'), 'top-right')
  } catch (error) {
    logger.error(error)
    displayNotification('error', t('save-failed'))
  } finally {
    isSaving.value = false
  }
}

onMounted(async () => {
  try {
    canEdit.value = getCanEdit(isCollab.value)
    const forceDisabled = !canEdit.value
    informationFormStructure.value = await getFormStructure('CompanyProfile', forceDisabled)
    currentAccount.value = await fetchAccount(accountId)
    originalAccount.value = cloneDeep(currentAccount.value)
  } catch (error) {
    logger.error('Error fetching information :', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style lang="scss" scoped>
.folder-information {
  &__form-section-fields {
    gap: 0px 20px;
  }
}
</style>
<i18n lang="yaml">
en-US:
  billing: 'Company billing address'
  delivery: 'Company delivery address'
  save: 'Save modifications'
  save-succeeded: 'Save succeeded'
  save-failed: 'Save failed'
  alertInstruction: 'If any information is incorrect, please update it in the CRM'
fr-FR:
  billing: "Adresse de facturation de l'entreprise"
  delivery: "Adresse de livraison de l'entreprise"
  save: 'Enregistrer les modifications'
  save-succeeded: 'Enregistrement des modifications avec succès'
  save-failed: "L'enregistrement des modifications a échoué"
  alertInstruction: 'Si des informations sont incorrectes, veuillez les mettre à jour dans le CRM'
</i18n>
