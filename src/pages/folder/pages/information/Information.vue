<template>
  <div class="margin-top--6">
    <PAlert id="folder-information-alert" data-testid="alert-instruction">
      {{ t('alertInstruction') }}
    </PAlert>
    <PForm
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
          {{ section.title }}
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
import { useI18n } from 'vue-i18n'
import { PAlert, PForm, PFieldSet } from '@kpmg/styleguide'
import { getInformationFormStructure } from './utils/InformationUtils'
import { getMockedAccount } from '@/services/account/accountMock'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const accountModel = getMockedAccount()
const informationFormStructure = getInformationFormStructure()
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
  alertInstruction: 'If any information is incorrect, please update it in the CRM'
fr-FR:
  alertInstruction: 'Si des informations sont incorrectes, veuillez les mettres à jour dans le CRM'
</i18n>
