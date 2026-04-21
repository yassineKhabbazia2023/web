<template>
  <div class="flex flex-gap--4 flex--wrap flex--justify-content-stretch">
    <PField
      v-for="(field, index) in internalFields"
      :key="index"
      v-bind="field"
      @update:model-value="(value: any) => onUpdateModelValue(field.pFieldKey, value)"
    />
  </div>
</template>

<script setup lang="ts" generic="T">
import { computed, ref } from 'vue'
import PField from '../PField'
import type { PFieldSetProps } from './PFieldSetTypes'
import { getInternalFields } from './PFieldSetUtils'

const props = withDefaults(defineProps<PFieldSetProps<T>>(), {
  pReadonly: false,
})

const disabledFields = ref<string[]>([])

const internalFields = computed(() =>
  getInternalFields<T>(props.pFields, props.pModel, props.pReadonly, disabledFields.value),
)

const emit = defineEmits<{
  'update:pModel': [string, any]
}>()

function onUpdateModelValue(fieldKey: string, fieldValue: any) {
  emit('update:pModel', fieldKey, fieldValue)
}

function enableField(fieldKey: string) {
  const disabledFieldIndex = disabledFields.value.indexOf(fieldKey)
  if (disabledFieldIndex !== -1) {
    disabledFields.value.splice(disabledFieldIndex, 1)
  }
}

function disableField(fieldKey: string) {
  const disabledFieldIndex = disabledFields.value.indexOf(fieldKey)
  if (disabledFieldIndex === -1) {
    disabledFields.value.push(fieldKey)
  }
}

defineExpose({
  enableField,
  disableField,
})
</script>
