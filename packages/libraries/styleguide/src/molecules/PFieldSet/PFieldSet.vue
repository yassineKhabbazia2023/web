<template>
  <div class="flex flex-gap--4 flex--wrap flex--justify-content-stretch">
    <PField
      v-for="(field, index) in internalFields"
      :key="index"
      :ref="(fieldRef: any) => registerFieldRef(fieldRef, field)"
      v-bind="field"
      @update:model-value="(value: any) => onUpdateModelValue(field.pFieldKey, value)"
    />
  </div>
</template>

<script setup lang="ts" generic="T">
import { computed, ref } from 'vue'
import PField from '../PField'
import type { PFieldProps } from '../PField/PFieldTypes'
import type { PFieldSetProps } from './PFieldSetTypes'
import { getInternalFields } from './PFieldSetUtils'

const props = withDefaults(defineProps<PFieldSetProps<T>>(), {
  pReadonly: false,
})

const disabledFields = ref<string[]>([])
const fieldRefs = ref<Record<string, typeof PField | null>>({})

const internalFields = computed(() =>
  getInternalFields<T>(props.pFields, props.pModel, props.pReadonly, disabledFields.value),
)

const emit = defineEmits<{
  'update:pModel': [string, any]
}>()

function onUpdateModelValue(fieldKey: string, fieldValue: any) {
  emit('update:pModel', fieldKey, fieldValue)
}

function registerFieldRef(fieldRef: any, field: PFieldProps<T>) {
  fieldRefs.value[field.pFieldKey] = fieldRef
}

function toggleField(fieldKey: string) {
  const disabledFieldIndex = disabledFields.value.indexOf(fieldKey)
  if (disabledFieldIndex !== -1) {
    disabledFields.value.splice(disabledFieldIndex, 1)
    return
  }
  disabledFields.value.push(fieldKey)
}

defineExpose({
  toggleField,
})
</script>
