<template>
  <PForm pLabelPosition="top">
    <PFormItem :pLabel="t('caseManagerLabel')">
      <PInput
        v-model="model.caseManagerContactId"
        :pPlaceholder="t('caseManagerPlaceholder')"
        data-testid="prospect-case-manager-input"
      />
    </PFormItem>
    <PFormItem :pLabel="t('accountManagerLabel')">
      <PInput
        v-model="model.accountManagerContactId"
        :pPlaceholder="t('accountManagerPlaceholder')"
        data-testid="prospect-account-manager-input"
      />
    </PFormItem>

    <h4 class="margin-top--5 margin-bottom--5">
      {{ t('signatoryTitle') }}
    </h4>

    <PFormItem :pLabel="t('titleLabel')">
      <PInput
        v-model="model.signatory.title"
        data-testid="prospect-signatory-title-input"
      />
    </PFormItem>
    <PFormItem :pLabel="t('lastNameLabel')">
      <PInput
        v-model="model.signatory.lastName"
        data-testid="prospect-signatory-lastname-input"
      />
    </PFormItem>
    <PFormItem :pLabel="t('firstNameLabel')">
      <PInput
        v-model="model.signatory.firstName"
        data-testid="prospect-signatory-firstname-input"
      />
    </PFormItem>
    <PFormItem :pLabel="t('jobTitleLabel')">
      <PInput
        v-model="model.signatory.jobTitle"
        data-testid="prospect-signatory-jobtitle-input"
      />
    </PFormItem>
    <PFormItem :pLabel="t('departmentLabel')">
      <PInput
        v-model="model.signatory.department"
        data-testid="prospect-signatory-department-input"
      />
    </PFormItem>
    <PFormItem :pLabel="t('companyRoleLabel')">
      <PInput
        v-model="model.signatory.companyRole"
        data-testid="prospect-signatory-companyrole-input"
      />
    </PFormItem>
    <PFormItem :pLabel="t('contactTypesLabel')">
      <PInput
        v-model="model.signatory.contactTypes"
        data-testid="prospect-signatory-contacttypes-input"
      />
    </PFormItem>
    <PFormItem :pLabel="t('emailLabel')">
      <PInput
        v-model="model.signatory.email"
        data-testid="prospect-signatory-email-input"
      />
    </PFormItem>
    <PFormItem :pLabel="t('mobilePhoneLabel')">
      <PInput
        v-model="model.signatory.mobilePhone"
        data-testid="prospect-signatory-mobilephone-input"
      />
    </PFormItem>
  </PForm>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PForm, PFormItem, PInput } from '@pulse/styleguide/components'
import type { ProspectFormData } from '../../prospect-creation-drawer.types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      caseManagerLabel: 'Case Manager Contact ID',
      caseManagerPlaceholder: 'Enter case manager contact ID',
      accountManagerLabel: 'Account Manager Contact ID',
      accountManagerPlaceholder: 'Enter account manager contact ID',
      signatoryTitle: 'Signatory',
      titleLabel: 'Title',
      lastNameLabel: 'Last name',
      firstNameLabel: 'First name',
      jobTitleLabel: 'Job title',
      departmentLabel: 'Department',
      companyRoleLabel: 'Company role',
      contactTypesLabel: 'Contact types (comma-separated)',
      emailLabel: 'Email',
      mobilePhoneLabel: 'Mobile phone',
    },
    'fr-FR': {
      caseManagerLabel: 'Case Manager Contact ID',
      caseManagerPlaceholder: 'Saisir le contact ID du case manager',
      accountManagerLabel: 'Account Manager Contact ID',
      accountManagerPlaceholder: 'Saisir le contact ID de l\'account manager',
      signatoryTitle: 'Signataire',
      titleLabel: 'Civilité',
      lastNameLabel: 'Nom',
      firstNameLabel: 'Prénom',
      jobTitleLabel: 'Fonction',
      departmentLabel: 'Service',
      companyRoleLabel: 'Rôle dans la société',
      contactTypesLabel: 'Types de contact (séparés par des virgules)',
      emailLabel: 'Email',
      mobilePhoneLabel: 'Téléphone mobile',
    },
  },
})

const model = defineModel<ProspectFormData>({ required: true })
</script>
