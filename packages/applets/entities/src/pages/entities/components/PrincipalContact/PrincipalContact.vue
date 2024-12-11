<template>
  <PUserCard
    :pTitle="fullName"
    :pTag="contactTag"
    :pSubtitle="principalContact.email"
    :pDescription="contactDescription"
    pImageName="user-male"
    class="principal-contact"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { getFullName } from '@entities/common/utils'
import { PUserCard, PIVectorPen } from '@pulse/styleguide/components'
import type { PrincipalContactProps } from './PrincipalContactTypes'
import type { PTagProps } from '@pulse/styleguide/types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<PrincipalContactProps>()
const contactDescription = t('contactDescription')
const contactTag: PTagProps = {
  pSize: 'default',
  pColor: 'persian',
  pContent: t('signatoryCustomer'),
  pIconLeft: PIVectorPen,
  pEffect: 'light',
}

const fullName = computed(() =>
  getFullName(
    props.principalContact.firstName,
    props.principalContact.lastName,
    true,
  ),
)
</script>

<style lang="scss" scoped>
.principal-contact {
  background: var(--el-color-neutral-gray-50);

  &__notes {
    color: var(--el-color-neutral-gray-900);
  }
}
</style>

<i18n lang="yaml">
en-US:
  signatoryCustomer: 'Signatory customer'
  contactDescription: 'This signatory user will be the first client embarked on the file.'
fr-FR:
  signatoryCustomer: 'Client signataire'
  contactDescription: 'Cet utilisateur signataire sera le premier client embarqué sur le dossier.'
</i18n>
