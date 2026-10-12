<template>
  <div
    class="
      key-moments-comment-composer
      flex
      flex-gap--3
    "
    :data-testid="testIdPrefix"
  >
    <PAvatar
      class="flex--shrink-0"
      pType="small"
      pColor="persian-600"
    >
      {{ author.tabLabel }}
    </PAvatar>

    <div class="key-moments-comment-composer__content">
      <PInput
        v-model="draft"
        pType="textarea"
        :pRows="2"
        :pPlaceholder="t('keyMoments.comment.composerPlaceholder')"
        :pDisabled="isSaving"
        :pTestId="`${testIdPrefix}-input`"
      />
      <div
        class="
          flex
          flex-gap--2
          margin-top--2
        "
      >
        <PButton
          pType="primary"
          pSize="small"
          :pDisabled="isDraftEmpty"
          :pLoading="isSaving"
          :pTestId="`${testIdPrefix}-save-button`"
          @click="save"
        >
          {{ t('keyMoments.comment.save') }}
        </PButton>
        <PButton
          pType="secondary"
          pSize="small"
          :pDisabled="isDraftEmpty || isSaving"
          :pTestId="`${testIdPrefix}-cancel-button`"
          @click="draft = ''"
        >
          {{ t('keyMoments.comment.cancel') }}
        </PButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { isNullOrEmpty } from '@pulse/toolbox/utils/validator'
import { PAvatar, PButton, PInput } from '@pulse/styleguide/components'
import { useKeyMomentsEditionStore } from '../../stores/key-moments-edition.store'
import type { CommentVariant, SaveSettlement } from '../../types/key-moments.types'

defineProps<{
  /** The variant my first comment will be saved under */
  author: CommentVariant
  /** Stem of the `data-testid` of the field and of its buttons */
  testIdPrefix: string
}>()

const emit = defineEmits<{
  save: [text: string, settle: SaveSettlement]
}>()

const { t } = useI18n()
const editionStore = useKeyMomentsEditionStore()

const draft = ref('')
const isSaving = ref(false)

const isDraftEmpty = computed(() => isNullOrEmpty(draft.value.trim()))

// Always open, so only words being written hold the report back from re-rendering
watch(isDraftEmpty, (isEmpty) => {
  if (isEmpty) {
    editionStore.closeEdition()
  } else {
    editionStore.openEdition()
  }
})

onUnmounted(() => {
  if (isDraftEmpty.value === false) {
    editionStore.closeEdition()
  }
})

// A failed write keeps what was typed
function save(): void {
  if (isSaving.value || isDraftEmpty.value) {
    return
  }

  isSaving.value = true
  emit('save', draft.value, (isSaved) => {
    isSaving.value = false

    if (isSaved) {
      draft.value = ''
    }
  })
}
</script>

<style scoped lang="scss">
.key-moments-comment-composer {
  padding: 14px 16px;
  background-color: var(--p-surface-basic-primary);
  box-shadow: 0 1px 2px rgba(var(--p-black-rock-900-rgb), 0.06);

  &__content {
    flex: 1;
    min-width: 0;
  }
}
</style>
