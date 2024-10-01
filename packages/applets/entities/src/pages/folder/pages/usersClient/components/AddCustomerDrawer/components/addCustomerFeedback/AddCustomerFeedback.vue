<template>
  <div class="add-customer-feedback">
    <PUserCard
      pAssetLeft="Image"
      pAssetContent="user-male"
      pColor="gray"
      :pTitle="fullName"
      :pSubtitle="email"
    />
    <div
      class="
        add-customer-feedback__state-image
        margin-x--auto margin-top--10"
    >
      <PImage
        pType="paupulse"
        :pName="hasError ? 'maintenance' : 'ok'"
      />
    </div>
    <PAlert v-if="hasError" pType="danger">
      {{ t('technicalError') }}
    </PAlert>
    <div
      v-else
      class="text-center"
      data-testid="valid-add-customer-request-text"
    >
      <h3 class="font-semibold margin-bottom--2">
        {{ t('contactInvited') }}
      </h3>
      <div class="add-customer-feedback__state-text margin-x--auto">
        <p class="margin-top--2 margin-bottom--4">
          {{ t('ifContactDoesNotExist') }}
        </p>
        <p class="margin-bottom--6">
          {{ t('ifContactExists') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { PUserCard, PImage, PAlert } from '@pulse/styleguide'
import type { AddCustomerFeedbackProps } from './AddCustomerFeedbackTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

withDefaults(defineProps<AddCustomerFeedbackProps>(), {
  hasError: false,
})
</script>

<style lang="scss" scoped>
.add-customer-feedback {
  &__state-image {
    width: 316px;
  }

  &__state-text {
    width: 55%;
  }
}
</style>

<i18n lang="yaml">
  en-US:
    contactInvited: 'User has been invited!'
    ifContactDoesNotExist: 'If your contact is a new user, he will receive his welcome email to create his account'
    ifContactExists: >
      If your contact already has an account on the platform then it can connect directly to it.
    technicalError: 'Your contact was not added due to a technical error. Please try again later.'
  fr-FR:
    contactInvited: 'Votre contact a bien été invité !'
    ifContactDoesNotExist: >
      Si votre contact est un nouvel utilisateur, il va recevoir son e-mail de bienvenue pour créer son compte.
    ifContactExists: >
      Si votre contact a déjà un compte sur la plateforme alors il peut s'y connecter directement.
    technicalError: "Votre contact n'a pas été ajouté suite à une erreur technique. Veuillez réessayer plus tard."
</i18n>
