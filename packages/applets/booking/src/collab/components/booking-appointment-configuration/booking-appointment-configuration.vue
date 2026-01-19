<template>
  <div class="flex flex--direction-column flex-gap--6">
    <h3 class="font-large">
      {{ t('booking-appointment-configuration.title') }}
    </h3>

    <PForm
      ref="formRef"
      :pModel="formData"
      :pRules="rules"
      pLabelPosition="top"
      pRequireAsteriskPosition="right"
    >
      <!-- Name field -->
      <PFormItem
        class="margin-bottom--6"
        pProp="name"
        :pLabel="t('booking-appointment-configuration.name.label')"
      >
        <PInput
          v-model="formData.name"
          :pPlaceholder="t('booking-appointment-configuration.name.placeholder')"
        />
      </PFormItem>

      <!-- Description field -->
      <PFormItem
        class="margin-bottom--6"
        pProp="description"
        :pLabel="t('booking-appointment-configuration.description.label')"
      >
        <PInput
          v-model="formData.description"
          pType="textarea"
          :pRows="4"
          :pPlaceholder="t('booking-appointment-configuration.description.placeholder')"
        />
      </PFormItem>

      <!-- Duration field -->
      <PFormItem
        class="margin-bottom--6"
        pProp="duration"
        :pLabel="t('booking-appointment-configuration.duration.label')"
      >
        <PDropdown
          v-model="formData.duration"
          :pOptions="durationOptions"
          class="booking-appointment-configuration__dropdown"
        />
      </PFormItem>

      <!-- Location field (conditional) -->
      <Transition name="fade" mode="out-in">
        <PFormItem
          v-if="formData.isOnline === false"
          key="location"
          pProp="location"
          :pLabel="t('booking-appointment-configuration.location.label')"
        >
          <PInput
            v-model="formData.location"
            :pPlaceholder="t('booking-appointment-configuration.location.placeholder')"
          />
        </PFormItem>
      </Transition>

      <!-- Online switch (outside PFormItem because no validation is needed) -->
      <div class="flex flex--items-center flex-gap--3 margin-top--2">
        <PSwitch
          v-model="formData.isOnline"
          :pActiveColor="AppColors.JUNGLE_400"
        />
        <label
          class="
            flex
            items-center
          "
        >
          {{ t('booking-appointment-configuration.isOnline.label') }}
          <PTooltip :pContent="t('booking-appointment-configuration.isOnline.tooltip')">
            <PIcon
              pName="questionCircle"
              pSize="16"
              class="margin-left--2"
            />
          </PTooltip>
        </label>
      </div>
    </PForm>

    <PAlert
      key="online-alert"
      pType="information"
      class="booking-appointment-configuration__online-alert"
    >
      <i18n-t keypath="booking-appointment-configuration.onlineAlert" tag="span">
        <template #note>
          <strong>{{ t('booking-appointment-configuration.onlineAlertNote') }}</strong>
        </template>
      </i18n-t>
    </PAlert>

    <Teleport to="#booking-drawer__footer">
      <div class="margin-left--auto">
        <PButton
          pType="secondary"
          pPlain
          class="margin-right--4"
          @click="emit('previous-step')"
        >
          {{ t('booking-configuration.buttons.previous') }}
        </PButton>

        <PButton
          pType="primary"
          @click="handleNextStep"
        >
          {{ t('booking-configuration.buttons.next') }}
        </PButton>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PAlert, PButton, PDropdown, PInput, PSwitch, PForm, PFormItem, PIcon, PTooltip } from '@pulse/styleguide/components'
import type { FormInstance } from 'element-plus'
import { AppColors } from '@pulse/styleguide'
import type { AppointmentDetails } from './booking-appointment-configuration.types'
import { useBookingAppointmentValidation } from './booking-appointment-configuration.validation'

const props = defineProps<{
  modelValue: AppointmentDetails
}>()

const emit = defineEmits<{
  'update:modelValue': [AppointmentDetails]
  'next-step': []
  'previous-step': []
}>()

const { t } = useI18n({ useScope: 'global' })

const formData = computed({
  get: () => props.modelValue,
  set: (value: AppointmentDetails) => emit('update:modelValue', value),
})

const { rules, durationOptions } = useBookingAppointmentValidation(formData)

const formRef = ref<FormInstance>()

async function handleNextStep() {
  if (formRef.value === undefined) {
    return
  }
  try {
    await formRef.value.validate()
    emit('next-step')
  } catch {
    // Validation failed, do nothing
  }
}
</script>
