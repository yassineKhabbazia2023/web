<template>
  <div class="company-information">
    <div class="company-information__note">
      <p id="company-info-note">
        {{ t('formInstruction') }}
      </p>
    </div>
    <PAlert
      class="margin-y--3"
      id="company-info-alert"
      data-testid="alert-instruction"
    >
      {{ t('alertInstruction') }}
    </PAlert>
    <PForm
      v-if="providerName && internalAccount"
      :pModel="internalAccount"
      pLabelPosition="top"
      class="company-information__form"
      aria-describedby="company-info-note company-info-alert"
    >
      <section
        v-for="(section, index) in formStructure"
        :key="`section-${index}`"
        class="
        company-information__form-section
        shadow--3
        radius--1
        padding-x--5
        padding-bottom--1
        margin-bottom--3"
      >
        <p
          class="company-information__form-section-title font-bold padding-top--5 margin-bottom--3"
        >
          {{ section.title }}
        </p>
        <PFieldSetAccount
          :pModel="internalAccount"
          :pFields="section.fields"
          class="company-information__form-section-fields"
          @update:p-model="
            (fieldKey, fieldValue) =>
              handleUpdateAccountModel(fieldKey, fieldValue)
          "
        />
      </section>
    </PForm>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { cloneDeep, setWith } from 'lodash-es'
import { PAlert, PForm, PFieldSet } from '@kpmg/styleguide'
import { getOfferFormStructure } from './utils/CompanyInformationUtils'
import { type Account } from '@/services/account'
import type {
  CompanyInformationProps,
  FormSection,
} from './CompanyInformationTypes'

const PFieldSetAccount = PFieldSet<Account>

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<CompanyInformationProps>()
const emit = defineEmits<{
  'input': [string, any]
}>()

const formStructure = ref<FormSection[]>()
const internalAccount = ref<Account | undefined>()

const handleUpdateAccountModel = (fieldKey: string, fieldValue: any) => {
  if (internalAccount.value === undefined) {
    return
  }
  setWith(internalAccount.value, fieldKey, fieldValue, Object)
  emit('input', fieldKey, fieldValue)
}

onMounted(async () => {
  try {
    internalAccount.value = cloneDeep(props.modelValue)
    if (props.providerName) {
      formStructure.value = await getOfferFormStructure(props.providerName)
    }
  } catch (e) {
    console.error(e)
  }
})
</script>

<style lang="scss" scoped>
.company-information {
  &__form-section-fields {
    gap: 0px 20px;
  }
}
</style>

<i18n lang="yaml">
  en-US:
    alertInstruction: 'If the immutable information is incorrect, you need to update it in the CRM'
    formInstruction: 'Please provide the following necessary information for activation :'
  fr-FR:
    alertInstruction: 'Si les informations non modifiables sont incorrectes, vous devez les modifier dans le CRM'
    formInstruction: "Veuillez renseigner les informations suivantes nécessaires pour l'activation :"
</i18n>
