<template>
  <Story title="Atoms/Pastille" icon="teenyicons:circle-outline">
    <Variant title="Basic usage">
      <p-pastille>1</p-pastille>
    </Variant>

    <Variant title="Basic usage longer">
      <p-pastille>12345</p-pastille>
    </Variant>

    <Variant title="With icon">
      <p-pastille iconName="PITrash" />
    </Variant>

    <Variant title="Warning usage">
      <p-pastille kind="warning">
      1
      </p-pastille>
    </Variant>

    <Variant title="Disabled usage">
      <p-pastille disabled>
        1
      </p-pastille>
    </Variant>
  </Story>
</template>

<docs lang="md">
  <div class="container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=sastdstorybook.z28.web.core.windows.net&amp;url=https://www.figma.com/file/xcugC6MchXrgyIq6yHrjf7/Librairie?node-id=5373%3A17809"></iframe>
  </div>

  This component is a simple circle than can take characters / numbers content or an icon.
</docs>

<script setup lang="ts">
import PPastille from './'
</script>
