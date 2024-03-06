<template>
  <PUserCard
    :pTitle="fullName"
    :pTag="contactTag"
    :pSubtitle="principalContact.contactEmail"
    :pDescription="contactDescription"
    pAssetLeft="Image"
    pAssetContent="user-male"
    class="principal-contact"
  />
</template>

<i18n lang="yaml">
en-US:
  signatoryCustomer: 'Signatory customer'
  contactDescription: 'This signatory user will be the first client embarked on the file.'
fr-FR:
  signatoryCustomer: 'Client signataire'
  contactDescription: 'Cet utilisateur signataire sera le premier client embarqué sur le dossier.'
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import {
  PUserCard,
  PIVectorPen
} from '@kpmg/styleguide'
import type { PrincipalContactProps } from './PrincipalContactTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const fullName = computed(() => {
  return `${props.principalContact?.firstName ?? ''} ${
    props.principalContact?.lastName?.toUpperCase() ?? ''
  }`
})
const contactDescription = t('contactDescription')
const contactTag = {
  pSize: 'default',
  pColor: 'persian',
  pContent: t('signatoryCustomer'),
  pIconLeft: PIVectorPen,
  pEffect: 'light'
}

const props = defineProps<PrincipalContactProps>()
</script>

<style lang="scss" scoped>
.principal-contact {
  background: var(--el-color-neutral-gray-50);

  &__notes {
    color: var(--el-color-neutral-gray-900);
  }
}
</style>
