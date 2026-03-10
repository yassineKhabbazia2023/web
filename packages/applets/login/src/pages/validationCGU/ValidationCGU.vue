<template>
  <div class="validation-cgu text-left">
    <h1 class="h4 margin-y--4">
      {{ t('titleCGU') }}
    </h1>
    <p class="margin-bottom--10 font-large font-normal">
      {{ t('contentCGU') }}
    </p>
    <PForm
      ref="cguFormRef"
      :pRules="rules"
      :pModel="formValue"
    >
      <PFormItem
        pProp="terms"
        class="margin-bottom--10"
      >
        <PCheckbox
          ref="checkbox"
          v-model="formValue.terms"
          class="
            validation-cgu__checkbox
            font-base font-normal
            padding--3
            bg--neutral-gray-50
            width-100
          "
        >
          {{ t('cguMessagePartOne') }}
          <a
            :href="urlTerms"
            target="_blank"
            class="validation-cgu__link font-bold text-color--black-rock-700"
          >
            {{ t('cguLink') }}
          </a>
          {{ t('cguMessagePartTwo') }}
        </PCheckbox>
      </PFormItem>
      <PTooltip
        v-if="!formValue.terms"
        :pContent="t('contentCGU')"
        pPlacement="top"
      >
        <PButton
          pDisabled
          pType="primary"
          class="width-100 margin-bottom--2"
        >
          {{ t('confirm') }}
        </PButton>
      </PTooltip>
      <PButton
        v-else
        pType="primary"
        class="width-100 margin-bottom--2"
        :pDisabled="loading"
        :pLoading="loading"
        data-testid="cgu-button-confirm"
        @click="acceptNewCgu(termsId)"
      >
        {{ t('confirm') }}
      </PButton>
      <PButton
        pType="white"
        class="width-100"
        data-testid="cgu-button-back"
        @click="back()"
      >
        {{ t('back') }}
      </PButton>
    </PForm>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { logger } from '@pulse/toolbox'
import type { FormRules } from 'element-plus'
import { PButton, PCheckbox, PForm, PFormItem, PTooltip } from '@pulse/styleguide/components'
import { type ValidationCGUProps } from './ValidationCGUTypes'
import { CurrentUserManager } from '@pulse/common/managers'
import { fetchUrlTerms, updateTermsByCurrentUser } from '@pulse/common/services/cgu'
import { RouteName } from '@pulse/common/enums'
import { useUserStore } from '@pulse/common/stores'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const router = useRouter()
const userStore = useUserStore()

defineProps<ValidationCGUProps>()

const formValue = reactive({
  terms: false,
})
const cguFormRef = ref()
const urlTerms = ref('')
const loading = ref(false)

const rules = reactive<FormRules<typeof formValue>>({
  terms: [{ trigger: 'change', required: true, message: t('cguRequired') }],
})

onMounted(async () => {
  urlTerms.value = await fetchUrlTerms()
})

const acceptNewCgu = async (termsId: string) => {
  try {
    loading.value = true
    await updateTermsByCurrentUser(parseInt(termsId))
    userStore.setHasAcceptedCGU(true)
    router.push({ name: RouteName.LANDING })
  } catch (error) {
    userStore.setHasAcceptedCGU(false)
    logger.error(error)
  } finally {
    loading.value = false
  }
}

const back = async () => {
  await CurrentUserManager.logout()
  router.push({ name: RouteName.LOGIN_CLIENT })
}
</script>

<style lang="scss" scoped>
.validation-cgu  {
  &__checkbox {
    align-items: start;
    white-space: pre-wrap;
    height: auto;
  }
  &__link {
    &:hover,
    &:focus {
      text-decoration: underline;
    }
  }
}
.width-100 {
  width: 100%;
}
</style>

<i18n lang="yaml">
  en-US:
    titleCGU: 'We have updated our terms of use'
    contentCGU: 'To access the platform, please review and accept these changes.'
    cguMessagePartOne: 'By checking this box, I confirm that I have read and accepted the '
    cguRequired: 'Accept terms in order to access platform'
    cguLink: 'general terms and conditions of use '
    cguMessagePartTwo: 'of RYDGE Conseil.'
    confirm: 'Confirm'
    back: 'Back'
  fr-FR:
    titleCGU: 'Nous avons mis à jour nos conditions générales d’utilisation'
    contentCGU: 'Pour accéder à la plateforme, veuillez consulter et accepter ces changements.'
    cguMessagePartOne: 'En cochant cette case, je confirme avoir lu et accepté les'
    cguRequired: 'Veuillez accepter les CGU pour accéder à la plateforme'
    cguLink: "conditions générales d'utilisation "
    cguMessagePartTwo: 'de RYDGE Conseil.'
    confirm: 'Confirmer'
    back: 'Retour'
</i18n>
