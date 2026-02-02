<template>
  <PUserCard
    :pTitle="fullName"
    :pTag="contactTag"
    :pSubtitle="principalContact.email"
    :pDescription="t('contactDescription')"
    pImageName="user-duotone"
    class="principal-contact"
  >
    <template v-if="currentSubscriptionOffer?.offerCode === SubscriptionOfferCode.PENNYLANE" #description>
      <p v-if="isMobilePhoneMissing === true" class="text-color--red-800">
        {{ t('missingPhoneNumber') }}
      </p>
      <p v-else>
        {{ formattedPhone }}
      </p>
    </template>
  </PUserCard>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { getFullNameWithUppercaseLastName } from '@entities/utils'
import { PUserCard } from '@pulse/styleguide/components'
import { SubscriptionOfferCode } from '@pulse/common/enums'
import { formatPhoneNumber } from '@pulse/toolbox/utils/string'
import type { PrincipalContactProps } from './PrincipalContactTypes'
import type { PTagProps } from '@pulse/styleguide/types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<PrincipalContactProps>()
const contactTag: PTagProps = {
  pSize: 'default',
  pColor: 'blue',
  pContent: t('signatoryCustomer'),
  pIconLeftName: 'vectorPen',
}

const fullName = computed(() =>
  getFullNameWithUppercaseLastName(
    props.principalContact.firstName,
    props.principalContact.lastName,
  ),
)

const isMobilePhoneMissing = computed(() =>
  props.principalContact.mobilePhone === undefined ||
  props.principalContact.mobilePhone === null ||
  props.principalContact.mobilePhone === '',
)

const formattedPhone = computed(() =>
  formatPhoneNumber(props.principalContact.mobilePhone),
)
</script>

<style lang="scss" scoped>
.principal-contact {
  background: var(--p-gray-50);
}
</style>

<i18n lang="yaml">
en-US:
  signatoryCustomer: 'Signatory customer'
  contactDescription: 'This signatory user will be the first client embarked on the file.'
  missingPhoneNumber: 'No phone number associated, please enter it in the Akuitéo CRM'
fr-FR:
  signatoryCustomer: 'Client signataire'
  contactDescription: 'Cet utilisateur signataire sera le premier client embarqué sur le dossier.'
  missingPhoneNumber: 'Aucun téléphone associé, veuillez le saisir dans le CRM Akuitéo'
</i18n>
