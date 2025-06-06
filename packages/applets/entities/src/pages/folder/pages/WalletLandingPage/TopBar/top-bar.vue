<template>
  <div
    class="
      home-top-bar
      margin-y--4
      flex
      flex-gap--4
    "
  >
    <PennylaneSSO v-if="TopBarManager.isPennylaneSSODisplayed()" />
  </div>
</template>

<script setup>
import { PennylaneSSO } from '@pulse/common/components'
import { TopBarManager } from './top-bar.manager'
</script>
