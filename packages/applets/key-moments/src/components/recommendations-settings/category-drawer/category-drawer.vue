<template>
  <PDrawer
    v-model="isOpen"
    :pTitle="category === undefined
      ? t('keyMoments.settings.recommendations.categoryDrawer.titleCreate')
      : t('keyMoments.settings.recommendations.categoryDrawer.titleEdit', { label: category.label })"
    pSize="760px"
    pTestId="key-moments-settings-recommendations-category-drawer"
    @close-drawer-button="close"
  >
    <PForm
      :pModel="form"
      pRequireAsteriskPosition="right"
    >
      <PFormItem
        :pLabel="t('keyMoments.settings.recommendations.categoryDrawer.label')"
        pRequired
      >
        <PInput
          v-model="form.label"
          pSize="small"
          :pMaxlength="CATEGORY_LABEL_MAX_LENGTH"
          pTestId="key-moments-settings-recommendations-category-label-input"
        />
      </PFormItem>

      <PFormItem :pLabel="t('keyMoments.settings.recommendations.categoryDrawer.pitch')">
        <PInput
          v-model="form.pitch"
          pType="textarea"
          :pRows="2"
          :pMaxlength="CATEGORY_PITCH_MAX_LENGTH"
          pShowWordLimit
          :pPlaceholder="t('keyMoments.settings.recommendations.categoryDrawer.pitchHint')"
          pTestId="key-moments-settings-recommendations-category-pitch-input"
        />
      </PFormItem>
    </PForm>

    <PDivider />

    <p class="font-semibold">
      {{ t('keyMoments.settings.recommendations.categoryDrawer.recommendations') }}
    </p>
    <p class="font-small text-color--text-neutral-neutral">
      {{ t('keyMoments.settings.recommendations.categoryDrawer.recommendationsHint') }}
    </p>

    <PLoader
      v-if="isLoading"
      pType="primary"
      pSize="24"
    />

    <!-- The same cards as the exercice, without the client visibility a category has no use for -->
    <RecommendationRubrics
      v-else
      :rubricViews="rubricViews"
      :catalog="catalog"
      :canAdd="canAdd"
      :hasVisibility="false"
      :areThemesUnreadable="areThemesUnreadable"
      isCompact
      testIdPrefix="key-moments-settings-recommendations-category"
      @add="(rubric, settle) => settle(addRecommendation(rubric))"
      @move="moveRecommendation"
      @update="updateRecommendation"
      @remove="removeRecommendation"
    />

    <template #footer>
      <div
        class="
          flex
          flex--align-items-center
          flex-gap--3
        "
      >
        <span
          v-if="areRecommendationsUnreadable"
          class="font-small text-color--text-neutral-neutral"
          data-testid="key-moments-settings-recommendations-category-unreadable-hint"
        >
          {{ t('keyMoments.settings.recommendations.categoryDrawer.unreadableHint') }}
        </span>
        <span
          v-else-if="hasIncompleteLine"
          class="font-small text-color--text-neutral-neutral"
          data-testid="key-moments-settings-recommendations-category-incomplete-hint"
        >
          {{ t('keyMoments.settings.recommendations.categoryDrawer.incompleteHint') }}
        </span>
        <PDrawerActions
          class="margin-left--auto"
          :pSecondaryCTA="{
            pLabel: t('keyMoments.settings.recommendations.categoryDrawer.cancel'),
            pTestId: 'key-moments-settings-recommendations-category-cancel-button',
          }"
          :pPrimaryCTA="{
            pLabel: t('keyMoments.settings.recommendations.categoryDrawer.save'),
            pLoading: isSaving,
            pDisabled: isSaveDisabled,
            pTestId: 'key-moments-settings-recommendations-category-save-button',
          }"
          @click-secondary-cta="close"
          @click-primary-cta="save"
        />
      </div>
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  PDivider,
  PDrawer,
  PDrawerActions,
  PForm,
  PFormItem,
  PInput,
  PLoader,
} from '@pulse/styleguide/components'
import { CATEGORY_LABEL_MAX_LENGTH, CATEGORY_PITCH_MAX_LENGTH } from '@key-moments/const/key-moments.consts'
import RecommendationRubrics from '@key-moments/components/recommendations/recommendation-rubrics.vue'
import { useCategoryDrawer } from './category-drawer.composable'

const emit = defineEmits<{
  saved: []
}>()

const { t } = useI18n()

const {
  isOpen,
  category,
  form,
  rubricViews,
  catalog,
  isLoading,
  isSaving,
  areThemesUnreadable,
  canAdd,
  hasIncompleteLine,
  areRecommendationsUnreadable,
  isSaveDisabled,
  openCreate,
  openEdit,
  close,
  save,
  addRecommendation,
  updateRecommendation,
  removeRecommendation,
  moveRecommendation,
} = useCategoryDrawer({ onSaved: () => emit('saved') })

defineExpose({ openCreate, openEdit })
</script>
