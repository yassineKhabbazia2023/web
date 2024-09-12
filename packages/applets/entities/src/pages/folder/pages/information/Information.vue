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
      :pModel="accountModel"
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
          :pModel="accountModel"
          :pFields="section.fields"
          class="folder-information__form-section-fields"
        />
      </section>
    </PForm>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { commonStore } from '@pulse/Common'
import { PAlert, PForm, PFieldSet, PLoader } from '@kpmg/styleguide'
import { fetchAccount, type Account } from '@entities/services/account'
import type { FormSection } from '@entities/pages/entities/components/CompanyInformation/CompanyInformationTypes'
import { getFormStructure } from '@entities/common/utils/referential'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const route = useRoute()
const isLoading = ref<boolean>(true)
const { isCollab } = storeToRefs(commonStore())
const accountModel = ref<Account | undefined>(undefined)
const informationFormStructure = ref<FormSection[]>()

const addressSectionTitle = computed(() =>
  accountModel.value?.address?.[0].addressType === 'billing'
    ? t('billing')
    : t('delivery'),
)

onMounted(async () => {
  try {
    informationFormStructure.value = await getFormStructure('CompanyProfile')
    accountModel.value = await fetchAccount(+route.params.id)
  } catch (error) {
    console.error('Error fetching information :', error)
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
  alertInstruction: 'If any information is incorrect, please update it in the CRM'
fr-FR:
  billing: "Adresse de facturation de l'entreprise"
  delivery: "Adresse de livraison de l'entreprise"
  alertInstruction: 'Si des informations sont incorrectes, veuillez les mettre à jour dans le CRM'
</i18n>
