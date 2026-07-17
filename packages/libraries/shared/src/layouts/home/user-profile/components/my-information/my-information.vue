<template>
  <div>
    <p
      class="
        h4
        margin-top--2
        margin-bottom--6
      "
    >
      {{ user.firstName }} <span class="text-uppercase">{{ user.lastName }}</span>
    </p>
    <PForm
      ref="formRef"
      :pModel="formValues"
      pRequireAsteriskPosition="right"
    >
      <div
        class="
          flex
          flex--justify-content-space-between
          fields-row
        "
      >
        <div class="half-width">
          <PFormItem
            :pLabel="t('role')"
            prop="personaName"
          >
            <PInput
              v-model="formValues.personaName"
              pName="personaName"
              pDisabled
            />
          </PFormItem>
        </div>

        <div class="half-width">
          <PFormItem
            :pLabel="t('mobilePhone')"
            prop="mobilePhone"
          >
            <PInput
              v-model="formValues.mobilePhone"
              pName="mobilePhone"
              pDisabled
            />
          </PFormItem>
        </div>
      </div>

      <PFormItem
        :pLabel="t('email')"
        class="margin-top--2"
        prop="email"
      >
        <PInput
          v-model="formValues.email"
          pName="email"
          pDisabled
        />
      </PFormItem>
      <div
        v-if="standalone === false"
        class="margin-top--6"
      >
        <LegalLinks
          :hasCgu="isCollab === false"
          class="margin-top--4 font-small"
        />
      </div>

      <!-- Drawer mode: teleport to drawer footer -->
      <Teleport
        v-if="standalone === false"
        defer
        to="#my-information__footer-drawer"
      >
        <div class="flex flex--justify-content-space-between">
          <LogoutButton />
        </div>
      </Teleport>
    </PForm>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { CurrentUserService } from '@pulse/common/services/current-user'
import { PForm, PFormItem, PInput } from '@pulse/styleguide/components'
import { LegalLinks } from '@pulse/shared/components'
import type { FormValues, MyInformationProps, User } from './my-information.type'
import LogoutButton from '../logout-button'

withDefaults(defineProps<MyInformationProps>(), {
  standalone: false,
})

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      role: 'Role',
      email: 'Email',
      mobilePhone: 'Mobile phone',
    },
    'fr-FR': {
      role: 'Rôle',
      email: 'Adresse mail',
      mobilePhone: 'Téléphone mobile',
    },
  },
})

const isCollab = ref(false)

const user = reactive<User>({
  firstName: '',
  lastName: '',
})

const formValues = reactive<FormValues>({
  email: '',
  personaName: '',
  mobilePhone: '',
})

onMounted(async () => {
  const me = await CurrentUserService.getCurrentUser()
  if (me) {
    user.lastName = me.lastName
    user.firstName = me.firstName
    isCollab.value = me.isCollab === true
    formValues.email = me.email
    formValues.personaName = me.persona?.name
    formValues.mobilePhone = me.officeMobile
  }
})
</script>

<style lang="scss" scoped>
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;

$gap: 12px;

.half-width {
  width: calc(50% - $gap/2);
}

// On small screens, stack the side-by-side fields (role / mobile phone)
// vertically and let them span the full width.
@include breakpoints.media(xs) {
  .fields-row {
    flex-direction: column;
  }

  .half-width {
    width: 100%;
  }
}
</style>

