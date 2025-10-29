<template>
  <PButton
    data-testid="modify-app-setting-button"
    pSize="small"
    pDisabled
  >
    <PIcon
      pName="pencilSquare"
      :pColor="AppColors.PERSIAN_300"
    />
  </PButton>
</template>

<script setup lang="ts">
import { PButton, PIcon } from '@pulse/styleguide/components'
import { AppColors } from '@pulse/styleguide'
</script>
