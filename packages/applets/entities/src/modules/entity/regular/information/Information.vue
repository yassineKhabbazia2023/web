<template>
  <div class="margin-top--2">
    <PAlert
      v-if="isCollab"
      id="entity-information-alert"
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
      class="entity-information__form margin-top--6"
      aria-describedby="entity-information-alert"
      data-testid="folder-information-form"
    >
      <template
        v-for="(section, index) in informationFormStructure"
        :key="`section-${index}`"
      >
        <section
          class="entity-information__form-section
          padding-x--5
          padding-bottom--1 margin-bottom--6"
        >
          <p
            class="entity-information__form-section-title font-bold padding-top--5 margin-bottom--3"
          >
            <span
              v-if="section.sectionKey === 'companyAddress'"
              data-testid="folder-information-form-address-section"
            >
              {{ t('companyContactDetails') }}
            </span>
            <span v-else>
              {{ section.title }}
            </span>
          </p>
          <PDynamicFields
            :pModel="currentAccount"
            :pFields="section.fields"
            class="entity-information__form-section-fields"
            @update:p-model="onInputAccount"
          />
        </section>
        <section
          v-if="section.sectionKey === 'electronicInvoicing'"
          class="entity-information__form-section
          padding-x--5
          padding-bottom--5 margin-bottom--6"
          data-testid="folder-information-form-addressing-identification-section"
        >
          <p
            class="entity-information__form-section-title font-bold padding-top--5 margin-bottom--3"
          >
            {{ t('addressingIdentification') }}
          </p>
          <AddressingIdentificationTable
            :addressingIdentifications="currentAccount?.addressingIdentifications"
          />
        </section>
      </template>
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
import { logger } from '@pulse/toolbox'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@pulse/common/stores'
import { PButton, PAlert, PForm, PDynamicFields, PLoader } from '@pulse/styleguide/components'
import { fetchAccount, type Account } from '@entities/services/account'
import type { FormSection } from '@entities/types'
import { getFormStructure, cleanRecordStructure } from '@entities/utils/referential'
import { getCanEdit, savePatchedAccount } from './InformationHelper'
import AddressingIdentificationTable from './addressing-identification-table.vue'
import { cloneDeep, get, setWith } from 'lodash-es'
import { addPathValue } from '@entities/services/patch-record/patch-record.service'
import { type PatchValue } from '@entities/services/patch-record'
import { displayNotification } from '@pulse/styleguide'
import { RouteParam } from '@pulse/common/enums'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      companyContactDetails: 'Company contact details',
      addressingIdentification: 'Addressing identification',
      save: 'Save modifications',
      'save-succeeded': 'Save succeeded',
      'save-failed': 'Save failed',
      alertInstruction: 'If any information is incorrect, please update it in the CRM',
    },
    'fr-FR': {
      companyContactDetails: 'Coordonnées de l\'entreprise',
      addressingIdentification: 'Identification d\'adressage',
      save: 'Enregistrer les modifications',
      'save-succeeded': 'Enregistrement des modifications avec succès',
      'save-failed': 'L\'enregistrement des modifications a échoué',
      alertInstruction: 'Si des informations sont incorrectes, veuillez les mettre à jour dans le CRM',
    },
  },
})

const props = withDefaults(defineProps<{
  pHiddenFieldKeys?: string[]
}>(), {
  pHiddenFieldKeys: () => [],
})

const userStore = useUserStore()
const { isCollab } = storeToRefs(userStore)

const route = useRoute()
const isLoading = ref<boolean>(true)
const currentAccount = ref<Account | undefined>(undefined)
const originalAccount = ref<Account | undefined>(undefined)
const informationFormStructure = ref<FormSection[]>()

const canEdit = ref(false)
const isSaving = ref(false)
const patchValues = ref<PatchValue[]>([])
const accountId = parseInt(`${route.params[RouteParam.ENTITY_ID]}`)

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

function filterHiddenFields(formStructure: FormSection[], hiddenFieldKeys: string[]): FormSection[] {
  if (hiddenFieldKeys.length === 0) {
    return formStructure
  }
  return formStructure.map(section => ({
    ...section,
    fields: section.fields.filter(field => hiddenFieldKeys.includes(field.pFieldKey) === false),
  }))
}

onMounted(async () => {
  try {
    canEdit.value = getCanEdit(isCollab.value ?? false)
    const forceDisabled = !canEdit.value
    const fetchedStructure = await getFormStructure('CompanyProfile', forceDisabled)
    informationFormStructure.value = filterHiddenFields(fetchedStructure, props.pHiddenFieldKeys)
    const account = await fetchAccount(accountId)
    if (account !== undefined) {
      cleanRecordStructure(informationFormStructure.value, account)
    }
    currentAccount.value = account
    originalAccount.value = cloneDeep(currentAccount.value)
  } catch (error) {
    logger.error('Error fetching information :', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style lang="scss" scoped>
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;

.entity-information {
  &__form-section-fields {
    gap: 0px 20px;

    @include breakpoints.media(xs) {
      flex-direction: column;
    }
  }
}
</style>
