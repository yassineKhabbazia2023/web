<template>
  <div
    class="
      flex
      flex-gap--4
      flex--wrap
      flex--justify-content-stretch
      "
  >
    <PField
      v-for="(field, index) in internalFields"
      :key="index"
      v-bind="field"
      @update:model-value="(value) => onUpdateModelValue(field.pFieldKey, value)"
    />
  </div>
</template>

<script setup lang="ts" generic="T">
import { computed } from 'vue'
import PField from '../PField'
import type { PFieldSetProps } from './PFieldSetTypes'
import { getInternalFields } from './PFieldSetUtils'

const props = withDefaults(defineProps<PFieldSetProps<T>>(), {
  pReadonly: false,
})

const internalFields = computed(() => getInternalFields<T>(props.pFields, props.pModel, props.pReadonly))

const emit = defineEmits<{
  'update:pModel': [string, any]
}>()

function onUpdateModelValue(fieldKey: string, fieldValue: any) {
  emit('update:pModel', fieldKey, fieldValue)
}
</script>
