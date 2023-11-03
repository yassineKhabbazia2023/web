<template>
  <Story title="2. Atoms/Loader" icon="radix-icons:reload">
    <Variant title="Gray loader">
      <PLoader size="32" />
    </Variant>

    <Variant title="Persian loader">
      <PLoader pType="primary" size="32" />
    </Variant>

    <Variant title="Gradient Loader">
      <PLoader pType="gradient" size="32" />
    </Variant>
  </Story>
</template>

<docs lang="md">
## PLoader

This component is used for loadings.

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D93%253A297%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>

<script setup lang="ts">
import PLoader from './'
</script>
