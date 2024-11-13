<template>
  <Story title="2. Atoms/Pastille" icon="teenyicons:circle-outline">
    <Variant title="Basic usage">
      <PPastille>1</PPastille>
    </Variant>

    <Variant title="Basic usage longer">
      <PPastille>12345</PPastille>
    </Variant>

    <Variant title="With icon">
      <PPastille pIconName="trash" />
    </Variant>

    <Variant title="Warning usage">
      <PPastille pType="warning">
        1
      </PPastille>
    </Variant>

    <Variant title="Disabled usage">
      <PPastille pDisabled>
        1
      </PPastille>
    </Variant>

    <Variant title="Persian usage">
      <PPastille pType="persian">
        1
      </PPastille>
    </Variant>

    <Variant title="Small usage">
      <PPastille pSize="small">
        1
      </PPastille>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PPastille from './'
</script>

<docs lang="md">
  ## Pastille
  This component is a simple circle than can take characters / numbers content or an icon.

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D1316%253A9267%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
