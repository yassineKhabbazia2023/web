<template>
  <div class="mep-planner-tickets-input">
    <PForm pLabelPosition="top">
      <PFormItem>
        <template #label>
          <span>Work Item IDs</span>
        </template>
        <div
          class="
            flex
            flex-gap--2
            flex--align-items-center
          "
        >
          <div class="mep-planner-tickets-input__field">
            <PInput
              v-model="model"
              pPlaceholder="12345, 12346, 12347"
              @keyup.enter="handleSearch"
              @paste="handlePaste"
            />
          </div>
          <PButton
            pType="primary"
            pSize="default"
            :pLoading="isLoading"
            :pDisabled="canSearch === false"
            @click="handleSearch"
          >
            Analyser
          </PButton>
        </div>
      </PFormItem>
    </PForm>
    <p
      class="
        text-color--neutral-gray-400
        font-small
        margin-top--2
      "
    >
      Saisissez un ou plusieurs IDs séparés par des virgules, espaces ou points-virgules
    </p>
  </div>
</template>

<script setup lang="ts">
import {
  PButton,
  PForm,
  PFormItem,
  PInput,
} from '@pulse/styleguide/components'
import { extractWorkItemIdsFromClipboard } from '@backoffice/utils/work-items-clipboard.utils'

const model = defineModel<string>({ required: true })

defineProps<{
  isLoading: boolean
  canSearch: boolean
}>()

const emit = defineEmits<{
  search: []
}>()

const handlePaste = (event: ClipboardEvent) => {
  if (event.clipboardData === null) {
    return
  }

  const ids = extractWorkItemIdsFromClipboard(event.clipboardData)

  if (ids.length > 0) {
    event.preventDefault()
    const existing = model.value.trim()
    const separator = existing !== '' ? ', ' : ''
    model.value = existing + separator + ids.join(', ')
  }
}

const handleSearch = () => {
  emit('search')
}
</script>

<style scoped lang="scss">
.mep-planner-tickets-input__field {
  width: min(500px, 75vw);
}
</style>
