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
        :pName="isError ? 'maintenance' : 'ok'"
      />
    </div>

    <div
      v-if="!isError"
      class="text-center"
      data-testid="valid-add-customer-request-text"
    >
      <h3>{{ t('contactInvited') }}</h3>
      <p class="margin-top--2 margin-bottom--4">
        {{ t('ifContactDoesNotExists') }}
      </p>

      <i18n-t
        class="margin-bottom--6"
        keypath="ifContactExists"
        tag="p"
      >
        <template #addEntity>
          <span class="font-bold">{{ t('addEntity') }}</span>
        </template>
        <template #myEntities>
          <span class="font-bold">{{ t('myEntities') }}</span>
        </template>
      </i18n-t>
    </div>
    <PAlert v-else-if="isError" pType="danger">
      {{ t('technicalError') }}
    </PAlert>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { PUserCard, PImage, PAlert } from '@kpmg/styleguide'
import type { AddCustomerFeedbackProps } from './AddCustomerFeedbackTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

withDefaults(defineProps<AddCustomerFeedbackProps>(), {
  isError: false,
})
</script>

<style lang="scss" scoped>
.add-customer-feedback {
  &__state-image {
    width: 316px;
  }
}
</style>

<i18n lang="yaml">
  en-US:
    contactInvited: 'User has been invited !'
    ifContactDoesNotExists: 'If the added contact is a new user, a welcome email has been sent'
    ifContactExists: >
      If the added contact already has a KPMG Pulse account,
      they will need to click on the {addEntity} button on the {myEntities} page.
    addEntity: 'Add Entity'
    myEntities: 'My Entities'
    technicalError: 'Contact has not been added due to technical reasons. Please try again later.'
  fr-FR:
    contactInvited: 'Votre contact a bien été invité !'
    ifContactDoesNotExists: 'Si votre contact est un nouvel utilisateur, il vient de recevoir son e-mail de bienvenue.'
    ifContactExists: >
      Si votre contact a déjà un compte sur la plateforme KPMG Pulse,
      il doit cliquer sur le le bouton {addEntity} dans sa page {myEntities}.
    addEntity: 'Ajouter une entité'
    myEntities: 'Mes entités'
    technicalError: "Votre contact n’a pas été ajouté suite à une erreur technique. Veuillez réessayer plus tard."
</i18n>
