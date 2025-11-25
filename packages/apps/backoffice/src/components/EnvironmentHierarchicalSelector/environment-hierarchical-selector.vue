<template>
  <div data-testid="environment-hierarchical-selector">
    <div
      v-for="group in groupedEnvironments"
      :key="group.environment"
      class="environment-group margin-bottom--4"
    >
      <p class="font-small font-semibold text-color--neutral-gray-900 margin--0 margin-bottom--2">
        {{ group.environment }}
      </p>

      <PCheckbox
        :modelValue="isEnvironmentSelected(group.environment)"
        :pLabel="group.environment"
        :disabled="props.disabled === true"
        :data-testid="`env-checkbox-${group.environment}`"
        class="environment-hierarchical-selector__checkbox"
        @update:model-value="handleToggle(group.environment, $event)"
      >
        <span class="font-medium">{{ group.environment }}</span>
      </PCheckbox>

      <PCheckbox
        v-for="label in group.labels"
        :key="`${group.environment}:${label}`"
        :modelValue="isLabelSelected(group.environment, label)"
        :pLabel="`${group.environment}:${label}`"
        :disabled="props.disabled === true"
        :data-testid="`env-checkbox-${group.environment}-${label}`"
        class="environment-hierarchical-selector__checkbox"
        @update:model-value="handleToggle(`${group.environment}:${label}`, $event)"
      >
        <span class="font-medium">{{ label }}</span>
      </PCheckbox>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PCheckbox } from '@pulse/styleguide/components'
import type { EnvironmentHierarchicalSelectorProps } from './environment-hierarchical-selector.type'
import { EnvironmentHierarchicalSelectorManager } from './environment-hierarchical-selector.manager'

const props = defineProps<EnvironmentHierarchicalSelectorProps>()

const emit = defineEmits<{
  'update:modelValue': [string[]]
}>()

const groupedEnvironments = computed(() =>
  EnvironmentHierarchicalSelectorManager.groupEnvironments(props.availableEnvironments),
)

function isEnvironmentSelected(environment: string): boolean {
  return EnvironmentHierarchicalSelectorManager.isEnvironmentSelected(props.modelValue, environment)
}

function isLabelSelected(environment: string, label: string): boolean {
  return EnvironmentHierarchicalSelectorManager.isLabelSelected(props.modelValue, environment, label)
}

function handleToggle(value: string, isChecked: boolean): void {
  const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(props.modelValue, value, isChecked)
  emit('update:modelValue', newValue)
}
</script>

<style scoped>
.environment-hierarchical-selector__checkbox {
  height: 30px;
}

.environment-group:last-child {
  margin-bottom: 0;
}
</style>
