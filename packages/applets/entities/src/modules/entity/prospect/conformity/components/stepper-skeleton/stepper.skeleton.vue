<template>
  <PSkeleton
    class="
      stepper-skeleton
      bg--white
      padding--4
    "
    pAnimated
  >
    <template #template>
      <div
        class="
          flex
          flex--direction-column
          flex-gap--6
        "
      >
        <!-- Header: title + description, like the PCompletionTracker header. -->
        <div>
          <PSkeletonItem
            pVariant="h3"
            pWidth="35%"
          />
          <div
            class="
              flex
              flex--direction-column
              flex-gap--1
              margin-top--2
            "
          >
            <PSkeletonItem pVariant="text" />
            <PSkeletonItem pVariant="text" />
            <PSkeletonItem
              pVariant="text"
              pWidth="55%"
            />
          </div>
        </div>

        <!-- Progression: label + percentage row, then the bar. -->
        <div>
          <div
            class="
              flex
              flex--align-items-center
              flex--justify-content-space-between
            "
          >
            <PSkeletonItem
              pVariant="text"
              :pWidth="90"
            />
            <PSkeletonItem
              pVariant="text"
              :pWidth="36"
            />
          </div>
          <PSkeletonItem
            pVariant="rect"
            pWidth="100%"
            :pHeight="8"
            class="margin-top--2"
          />
        </div>

        <!-- Section lists: a title then one 48px row per step, like PCompletionTrackerList. -->
        <div
          v-for="(sectionStepCount, sectionIndex) in SKELETON_SECTION_STEP_COUNTS"
          :key="sectionIndex"
        >
          <PSkeletonItem
            pVariant="text"
            :pWidth="110"
            class="margin-bottom--4"
          />
          <div
            class="
              flex
              flex--direction-column
              flex-gap--2
            "
          >
            <PSkeletonItem
              v-for="step in sectionStepCount"
              :key="step"
              pVariant="rect"
              pWidth="100%"
              :pHeight="48"
            />
          </div>
        </div>
      </div>
    </template>
  </PSkeleton>
</template>

<script setup lang="ts">
import { PSkeleton, PSkeletonItem } from '@pulse/styleguide/components'

// Mirrors the loaded tracker: one list per section (identity / documents /
// mission) with the full onboarding flow's step count per section.
const SKELETON_SECTION_STEP_COUNTS = [1, 3, 1]
</script>
