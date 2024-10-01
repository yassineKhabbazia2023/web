<template>
  <PDrawer
    v-model="isDrawerOpened"
    pSize="50%"
    @close-drawer-button="isDrawerOpened = false"
  >
    <template #header-prefix>
      <div class="add-customer-drawer__header">
        <span class="add-customer-drawer__entity-name">{{ targetEntityName }}</span>
        <h3>
          {{ isAddContactSucceeded ? t('userAdded') : t('addUser')}}
        </h3>
      </div>
    </template>
    <div v-if="!hasFormBeenSent">
      <PBlockHeader
        :pTitle="t('newUser')"
        :pDescription="t('setUserEmail')"
        :pHasButton="false"
        pColor="persian"
        pSize="big"
        :pImage="{
          pFit: 'fill',
          pType: 'portrait',
          pName: 'user-nonbinary-add'
        }"
      >
        <template #suffix>
          <PForm
            ref="addCustomerFormRef"
            pLabelPosition="top"
            pRequireAsteriskPosition="right"
            :pModel="newContact"
            :pRules="formRules"
            :pInlineMessage="false"
          >
            <PFormItem
              class="margin-bottom--4"
              :pLabel="t('email.address')"
              pProp="email"
              pValidateStatus="success"
            >
              <PInput
                v-model="newContact.email"
                pType="email"
                :pPlaceholder="t('email.placeholder')"
                data-testid="email-input"
              />
            </PFormItem>
          </PForm>
        </template>
      </PBlockHeader>
      <PAlert
        v-if="hasRoleOnAccount"
        pType="danger"
        class="margin-top--2"
      >
        {{ t('alreadyAddedToAccount') }}
      </PAlert>
    </div>
    <AddCustomerFeedback
      v-else
      :fullName="t('newUser')"
      :email="newContact.email"
      :hasError="hasFormSubmissionFailed"
    />
    <template #footer>
      <NextPreviousButtons
        v-if="!hasFormBeenSent"
        :previousLabel="t('previousLabel')"
        :nextLabel="t('nextLabel')"
        :isNextButtonDisabled="isNextButtonDisabled"
        :isNextButtonLoading="isNextButtonLoading"
        @click-next="handleAddContactFormSubmission"
        @click-previous="isDrawerOpened = false"
      />
      <PButton
        v-else
        pPlain
        pType="primary"
        data-testid="add-customer-cancel-button"
        @click="isDrawerOpened = false"
      >
        {{ t('close')}}
      </PButton>
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, reactive, ref, watch } from 'vue'
import { amplitudeService, debounce } from '@pulse/common'
import {
  PDrawer,
  PForm,
  PFormItem,
  PInput,
  PAlert,
  PButton,
  PBlockHeader,
  type FormRules,
} from '@kpmg/styleguide'
import type { AddCustomerDrawerProps } from './AddCustomerDrawerTypes'
import NextPreviousButtons from '@entities/common/components/NextPreviousButtons'
import AddCustomerFeedback from './components/addCustomerFeedback'
import { createCustomer, checkContactHasRoleOnAccount, addContactToEntity } from '@entities/services/account'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<AddCustomerDrawerProps>()
const emit = defineEmits<{
  'update:modelValue': [boolean]
  'refresh-customers-list': [void]
}>()

const isAddContactSucceeded = computed(() => hasFormBeenSent.value && !hasFormSubmissionFailed.value)
const isDrawerOpened = computed({
  get() {
    return props.modelValue
  },
  set(value: boolean) {
    emit('update:modelValue', value)
  },
})

const newContact = reactive({
  email: '',
})
const formRules = reactive<FormRules>({
  email: [
    {
      required: true,
      message: t('incorrectEmail'),
      trigger: 'blur',
      type: 'email',
    },
  ],
})

// #region Check Contact Role
const addCustomerFormRef = ref()
const hasRoleOnAccount = ref(false)
const isNextButtonLoading = ref(false)
const isNextButtonDisabled = ref(true)
const checkContactRole = async () => {
  isNextButtonLoading.value = true
  if (newContact.email) {
    try {
      await addCustomerFormRef.value.validate()
      // Check if the contact to be added exists in the database or has a role on the current account
      hasRoleOnAccount.value = await checkContactHasRoleOnAccount(newContact.email, props.targetEntityId)
      isNextButtonDisabled.value = hasRoleOnAccount.value
    } catch {
      isNextButtonDisabled.value = true
    }
  } else {
    isNextButtonDisabled.value = true
  }
  isNextButtonLoading.value = false
}
watch(newContact, debounce(() => checkContactRole(), 600))
// #endregion

// #region Handle Add Contact Form Submission
const NEW_USER = {
  firstName: 'Nouvel',
  lastName: 'Utilisateur',
}
const hasFormBeenSent = ref(false)
const hasFormSubmissionFailed = ref(false)
async function handleAddContactFormSubmission() {
  if (!addCustomerFormRef.value) return
  try {
    await addCustomerFormRef.value.validate()
    isNextButtonLoading.value = true
    await createCustomer({
      firstName: NEW_USER.firstName,
      lastName: NEW_USER.lastName,
      mobilePhone: '',
      email: newContact.email,
      accountNumber: props.targetEntityNumber,
    })
    onboardingSucceeded()
  } catch (error: any) {
    if (error.response.status === 409) {
      try {
        await addContactToEntity(props.targetEntityId, 0, newContact.email)
        onboardingSucceeded()
      } catch {
        onboardingFailed()
      }
    } else {
      onboardingFailed()
    }
  } finally {
    hasFormBeenSent.value = true
    isNextButtonLoading.value = false
  }
}
const onboardingFailed = () => {
  amplitudeService.track('Onboarding Started', {
    onboarding_start_localisation: "Ajout d'un utilisateur",
    onboarding_start_result: 'failed',
  })
  hasFormSubmissionFailed.value = true
}
const onboardingSucceeded = () => {
  amplitudeService.track('Onboarding Started', {
    onboarding_start_localisation: "Ajout d'un utilisateur",
    onboarding_start_result: 'succeeded',
  })
  emit('refresh-customers-list')
}
// #endregion

</script>

<style lang="scss" scoped>
.add-customer-drawer {
  &__entity-name {
    color: var(--el-color-neutral-gray-300)
  }
  &__add-image {
    width: 250px;
  }
}
</style>

<i18n lang="yaml">
  en-US:
    email:
      address: 'E-mail'
      placeholder: "lastName.firstName{'@'}exemple.fr"
    close: 'Close'
    nextLabel: 'Add'
    newUser: 'New user'
    addUser: 'Add a user'
    previousLabel: 'Cancel'
    userAdded: 'User added'
    incorrectEmail: "Email format in not valid"
    setUserEmail: "Please enter the email address of the user to be added"
    alreadyAddedToAccount: 'This user has already been added to this account'
  fr-FR:
    email:
      address: 'E-mail'
      placeholder: "nom.prenom{'@'}exemple.fr"
    close: 'Fermer'
    nextLabel: 'Ajouter'
    newUser: 'Nouvel utilisateur'
    addUser: 'Ajouter un utilisateur'
    previousLabel: 'Annuler'
    userAdded: 'Utilisateur ajouté'
    incorrectEmail: "L'adresse mail n'est pas conforme"
    setUserEmail: "Veuillez saisir l'adresse e-mail de l'utilisateur à ajouter"
    alreadyAddedToAccount: 'Cet utilisateur a déjà été ajouté à cette entité'
</i18n>
