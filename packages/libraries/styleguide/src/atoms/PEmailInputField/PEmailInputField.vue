<template>
  <div
    class="flex flex--align-items-center"
    style="width: 100%"
  >
    <PInput
      v-model="emailAddress.localPart"
      :pDisabled="pLocalPartDisabled"
      :pPlaceholder="pLocalPartPlaceholder"
      data-testid="local-part-email-input"
    />
    <span
      class="font-semibold margin-x--2"
      data-testid="at-sign-email-span"
    >
      @
    </span>
    <PInput
      v-model="emailAddress.domainPart"
      :pDisabled="pDomainPartDisabled"
      :pPlaceholder="pDomainPartPlaceholder"
      data-testid="domain-part-email-input"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import PInput from '../../atoms/PInput'
import type { PEmailInputFieldProps, EmailPartsType } from './p-email-input-field.types'

const props = withDefaults(defineProps<PEmailInputFieldProps>(), {
  modelValue: '',
  pDefaultDomainPart: '',
  pLocalPartDisabled: false,
  pDomainPartDisabled: false,
})

const emit = defineEmits<{
  'update:model-value': [string]
}>()

const emailAddress: EmailPartsType = reactive({
  localPart: '',
  domainPart: props.pDefaultDomainPart,
})

watch(emailAddress, () => {
  const fullEmailAddress = `${emailAddress?.localPart}@${emailAddress?.domainPart}`
  emit('update:model-value', fullEmailAddress)
})
</script>
