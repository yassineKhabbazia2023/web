<template>
  <Story title="2. Atoms/Activity Card"
    icon="material-symbols:browse-activity-sharp"
    :layout="{ type: 'grid', width: 432 }"
  >
    <Variant title="Activity Card">
      <div class="padding--4">
        <PActivityCard :pTime="PActivityCardData.time" :pInitials="PActivityCardData.initials">
          <span class="font-semibold">Alexandre De Lavandia</span> filed this document in the file <span class="font-semibold">April</span>
        </PActivityCard>
      </div>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import PActivityCard from '.'

const PActivityCardData = reactive({
  time: '16th september 2023 - 15:13:08',
  initials: 'AB'
})
</script>

<docs lang="md">
  ## Activity Card for Pulse

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D5313%253A828%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
