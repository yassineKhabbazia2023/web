<template>
  <Story
    title="2. Atoms/Overlay"
    icon="mingcute:rows-4-fill"
  >
    <Variant title="Without overEffect">
      <div class="position--relative">
        <div class="position--absolute">
          Permanent background
        </div>
        <POverlay
          pBackgroundColor="neutral-gray-500"
        >
          <div
            class="margin-top--12"
          >
            Overlay Content
          </div>
        </POverlay>
      </div>
    </Variant>

    <Variant title="With overEffect">
      <div class="position--relative">
        <div class="position--absolute">
          Permanent background
        </div>
        <POverlay
          pBackgroundColor="neutral-gray-500"
          pHasOverEffect
        >
          <div
            class="margin-top--12"
          >
            On hover content
          </div>
        </POverlay>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import POverlay from './POverlay.vue'
</script>
