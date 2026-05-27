<template>
  <div
    data-testid="environment-value-editor-selector"
    class="environment-value-editor padding-right--2"
  >
    <div
      v-for="group in groupedEnvironments"
      :key="group.environment"
      class="environment-group margin-y--3"
    >
      <PTag
        :pContent="`Environnement ${group.environment}`"
        pColor="gray"
        pSize="large"
        class="margin-bottom--3"
      />

      <!-- Env input -->
      <div class="environment-value-editor__row margin-bottom--4 flex--align-items-center">
        <label
          class="font-medium"
          :for="inputId(group.environment)"
        >
          {{ group.environment }}
        </label>

        <PInput
          :id="inputId(group.environment)"
          :modelValue="props.modelValue?.[group.environment] ?? ''"
          :disabled="props.disabled === true"
          :data-testid="`env-input-${group.environment}`"
          :pPlaceholder="`Valeur pour ${group.environment}`"
          @update:model-value="updateValue(group.environment, $event)"
        />
      </div>

      <!-- Labels inputs -->
      <div
        v-for="label in group.labels"
        :key="`${group.environment}:${label}`"
        class="environment-value-editor__row margin-bottom--2"
      >
        <label
          class="font-medium"
          :for="inputId(`${group.environment}:${label}`)"
        >
          {{ label }}
        </label>

        <PInput
          :id="inputId(`${group.environment}:${label}`)"
          :modelValue="props.modelValue?.[`${group.environment}:${label}`] ?? ''"
          :disabled="props.disabled === true"
          :data-testid="`env-input-${group.environment}-${label}`"
          :pPlaceholder="`Valeur pour ${label}`"
          @update:model-value="updateValue(`${group.environment}:${label}`, $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PInput, PTag } from '@pulse/styleguide/components'
import type { EnvironmentValueEditorProps } from './environment-value-editor.type'
import { EnvironmentValueEditorManager } from './environment-value-editor.manager'

const props = defineProps<EnvironmentValueEditorProps>()

const emit = defineEmits<{
  'update:modelValue': [Record<string, string>]
}>()

const groupedEnvironments = computed(() =>
  EnvironmentValueEditorManager.groupEnvironments(props.availableEnvironments),
)

function inputId(key: string): string {
  return `env-value-editor-${key.replace(/[^a-zA-Z0-9_-]/g, '-')}`
}

function updateValue(key: string, value: string): void {
  const next = EnvironmentValueEditorManager.setTargetValue(props.modelValue, key, value)
  emit('update:modelValue', next)
}
</script>


<style scoped lang="scss">
.environment-value-editor {
  max-height: 250px;
  overflow-y: auto;
}

.environment-group:last-child {
  margin-bottom: 0;
}
</style>
