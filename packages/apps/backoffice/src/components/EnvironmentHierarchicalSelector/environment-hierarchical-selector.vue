<template>
  <div data-testid="environment-hierarchical-selector">
    <div
      v-for="group in groupedEnvironments"
      :key="group.environment"
      class="environment-group margin-y--2"
    >
      <PTag
        :pContent="group.environment"
        pColor="gray"
        pSize="small"
        class="margin-bottom--2"
      />
      <br>

      <PCheckbox
        :modelValue="isEnvironmentSelected(group.environment)"
        :pIndeterminate="isEnvironmentIndeterminate(group.environment)"
        :pLabel="group.environment"
        :disabled="props.disabled === true"
        :data-testid="`env-checkbox-${group.environment}`"
        :border="true"
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
        :border="true"
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
import { PCheckbox, PTag } from '@pulse/styleguide/components'
import type { EnvironmentHierarchicalSelectorProps } from './environment-hierarchical-selector.type'
import { EnvironmentHierarchicalSelectorManager } from './environment-hierarchical-selector.manager'

const props = defineProps<EnvironmentHierarchicalSelectorProps>()

const emit = defineEmits<{
  'update:modelValue': [string[]]
}>()

const groupedEnvironments = computed(() =>
  EnvironmentHierarchicalSelectorManager.groupEnvironments(props.availableEnvironments),
)

const environmentStates = computed(() => {
  const states = new Map<string, { checked: boolean; indeterminate: boolean }>()
  groupedEnvironments.value.forEach((group) => {
    states.set(
      group.environment,
      EnvironmentHierarchicalSelectorManager.getParentCheckboxState(
        props.modelValue,
        group.environment,
        group.labels,
      ),
    )
  })
  return states
})

function isEnvironmentSelected(environment: string): boolean {
  return environmentStates.value.get(environment)?.checked ?? false
}

function isEnvironmentIndeterminate(environment: string): boolean {
  return environmentStates.value.get(environment)?.indeterminate ?? false
}

function isLabelSelected(environment: string, label: string): boolean {
  return EnvironmentHierarchicalSelectorManager.isLabelSelected(props.modelValue, environment, label)
}

function handleToggle(value: string, isChecked: boolean): void {
  const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(
    props.modelValue,
    value,
    isChecked,
    props.availableEnvironments,
  )
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
