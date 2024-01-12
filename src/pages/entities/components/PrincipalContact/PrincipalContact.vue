<template>
  <PUserCard
    data-testid="principal-contact"
    :pTitle="fullName"
    :pTag="contactType"
    :pSubtitle="principalContact.email"
    :pDescription="contactDescription"
    pAssetLeft="Image"
    pAssetContent="user-male"
    class="principal-contact"
  >
    <PButton
      data-testid="principal-contact-notes"
      pType="default"
      pSize="small"
      class="principal-contact__notes"
    >
      <PIcon class="el-button__icon--left">
        <PIPencilSquare />
      </PIcon>
      {{ t('note') }}
    </PButton>
  </PUserCard>
</template>

<i18n lang="yaml">
en-US:
  note: 'Note'
  signatoryCustomer: 'Signatory customer'
  contactDescription: 'This signatory user will be the first client embarked on the file.'
fr-FR:
  note: 'Note'
  signatoryCustomer: 'Client signataire'
  contactDescription: 'Cet utilisateur signataire sera le premier client embarqué sur le dossier.'
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import {
  PUserCard,
  PIVectorPen,
  PIPencilSquare,
  PButton,
  PIcon
} from '@kpmg/styleguide'
import type { PrincipalContactProps } from './PrincipalContactTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const fullName = computed(() => {
  return `${
    props.principalContact?.firstName
  } ${props.principalContact?.lastName?.toUpperCase()}`
})
const contactDescription = t('contactDescription')
const contactType = {
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
