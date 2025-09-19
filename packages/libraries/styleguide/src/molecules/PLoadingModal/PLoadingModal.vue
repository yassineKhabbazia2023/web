<template>
  <PDialog
    :modelValue="true"
    :pShowClose="false"
    :closeOnPressEscape="false"
    pWidth="420"
    pAlignCenter
    class="bg--transparent no-shadow"
  >
    <div
      class="
        flex
        flex--direction-column
        flex--align-items-center
        flex-gap--4
      "
    >
      <PLoader
        pType="primary"
        pSize="50"
      />
    </div>
  </PDialog>
</template>

<script setup lang="ts">
import PLoader from '../../atoms/PLoader'
import PDialog from '../../atoms/PDialog'
</script>
