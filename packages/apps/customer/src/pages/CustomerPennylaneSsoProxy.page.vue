<template>
  <div />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import type { GigyaSamlSDK } from '@customer/plugins/Gigya/gigya.types'

const gigyaGlobal = globalThis as typeof globalThis & { gigya?: GigyaSamlSDK }

onMounted(() => {
  // continueSSO(params, shouldRedirectToProxy)
  // - params: additional SAML parameters (empty = use URL query params)
  // - shouldRedirectToProxy: false = direct API call, true = redirect to proxy
  // We use false since we're already on the proxy page
  gigyaGlobal.gigya?.fidm?.saml?.continueSSO({}, false)
})
</script>
