<template>
  <PSkeleton
    class="conformity-section-skeleton margin-top--4"
    pAnimated
  >
    <template #template>
      <!-- Beneficial owner: tabs, identity form row, two CNI upload zones, actions. -->
      <template v-if="variant === ConformitySkeletonVariant.Beneficiary">
        <div
          class="
            flex
            flex-gap--4
            margin-bottom--6
          "
        >
          <PSkeletonItem
            pVariant="text"
            :pWidth="120"
          />
          <PSkeletonItem
            pVariant="text"
            :pWidth="120"
          />
        </div>

        <div
          class="
            flex
            flex-gap--4
            margin-bottom--6
          "
        >
          <div
            class="
              flex
              flex--direction-column
              flex-gap--1
              flex--basis-11
            "
          >
            <PSkeletonItem
              pVariant="text"
              pWidth="60%"
            />
            <PSkeletonItem
              pVariant="rect"
              :pHeight="40"
            />
          </div>
          <div
            class="
              flex
              flex--direction-column
              flex-gap--1
              flex--grow-1
            "
          >
            <PSkeletonItem
              pVariant="text"
              pWidth="50%"
            />
            <PSkeletonItem
              pVariant="rect"
              :pHeight="40"
            />
          </div>
          <div
            class="
              flex
              flex--direction-column
              flex-gap--1
              flex--grow-1
            "
          >
            <PSkeletonItem
              pVariant="text"
              pWidth="50%"
            />
            <PSkeletonItem
              pVariant="rect"
              :pHeight="40"
            />
          </div>
        </div>

        <div
          v-for="zone in 2"
          :key="zone"
          class="
            flex
            flex--direction-column
            flex-gap--1
            margin-bottom--4
          "
        >
          <PSkeletonItem
            pVariant="text"
            pWidth="35%"
          />
          <PSkeletonItem
            pVariant="rect"
            :pHeight="56"
          />
        </div>

        <div class="flex flex-gap--3">
          <PSkeletonItem
            pVariant="button"
            pWidth="100%"
          />
          <PSkeletonItem
            pVariant="button"
            pWidth="100%"
          />
        </div>
      </template>

      <!-- Supporting / complementary documents share the same footer frame. -->
      <template
        v-else-if="
          variant === ConformitySkeletonVariant.SupportingDocumentsUpload
            || variant === ConformitySkeletonVariant.SupportingDocumentsList
            || variant === ConformitySkeletonVariant.ComplementaryDocuments
        "
      >
        <!-- Complementary: one large dragger zone. -->
        <PSkeletonItem
          v-if="variant === ConformitySkeletonVariant.ComplementaryDocuments"
          pVariant="rect"
          :pHeight="120"
        />

        <!-- Supporting: one labelled block per document type (upload zone or file line). -->
        <template v-else>
          <div
            v-for="block in 2"
            :key="block"
            class="margin-bottom--4"
          >
            <PSkeletonItem
              pVariant="text"
              pWidth="35%"
              class="margin-bottom--1"
            />
            <PSkeletonItem
              pVariant="rect"
              :pHeight="isSupportingCompleted ? 40 : 56"
            />
          </div>
        </template>

        <div
          class="
            flex
            flex-gap--3
            margin-top--6
          "
        >
          <PSkeletonItem
            pVariant="button"
            pWidth="100%"
          />
          <PSkeletonItem
            pVariant="button"
            pWidth="100%"
          />
        </div>
      </template>

      <!-- In-progress proposal / engagement letter (collaborator): upload line + send button. -->
      <template v-else-if="variant === ConformitySkeletonVariant.DocumentUploadSend">
        <PSkeletonItem
          pVariant="rect"
          :pHeight="56"
        />
        <PSkeletonItem
          pVariant="button"
          pWidth="100%"
          class="margin-top--4"
        />
      </template>

      <!-- In-progress proposal / engagement letter (customer) or pending payment: single alert. -->
      <PSkeletonItem
        v-else-if="variant === ConformitySkeletonVariant.InfoAlert"
        pVariant="rect"
        :pHeight="56"
      />

      <!-- Payment method still to choose: benefit rows, footer actions. -->
      <div
        v-else-if="variant === ConformitySkeletonVariant.PaymentBenefits"
        class="
          flex
          flex--direction-column
          flex-gap--6
        "
      >
        <div
          class="
            flex
            flex--direction-column
            flex-gap--2
          "
        >
          <div
            v-for="benefit in 4"
            :key="benefit"
            class="
              flex
              flex--align-items-center
              flex-gap--2
            "
          >
            <PSkeletonItem
              pVariant="circle"
              :pWidth="16"
              :pHeight="16"
            />
            <PSkeletonItem
              pVariant="text"
              pWidth="45%"
            />
          </div>
        </div>
        <div class="flex flex-gap--3">
          <PSkeletonItem
            pVariant="button"
            pWidth="100%"
          />
          <PSkeletonItem
            pVariant="button"
            pWidth="100%"
          />
        </div>
      </div>

      <!-- Payment method completed: bullet list, transmitted box, download button. -->
      <div
        v-else-if="variant === ConformitySkeletonVariant.PaymentCompleted"
        class="
          flex
          flex--direction-column
          flex-gap--6
        "
      >
        <div
          class="
            flex
            flex--direction-column
            flex-gap--2
          "
        >
          <PSkeletonItem
            v-for="bullet in 3"
            :key="bullet"
            pVariant="text"
            pWidth="60%"
          />
        </div>
        <PSkeletonItem
          pVariant="rect"
          :pHeight="56"
        />
        <PSkeletonItem
          pVariant="button"
          pWidth="100%"
        />
      </div>
    </template>
  </PSkeleton>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PSkeleton, PSkeletonItem } from '@pulse/styleguide/components'
import { ConformitySkeletonVariant } from './conformity-section-skeleton.enums'
import type { ConformitySectionSkeletonProps } from './conformity-section-skeleton.types'

const props = defineProps<ConformitySectionSkeletonProps>()

// Completed supporting documents are read-only file lines (shorter) rather than upload zones.
const isSupportingCompleted = computed(
  () => props.variant === ConformitySkeletonVariant.SupportingDocumentsList,
)
</script>
