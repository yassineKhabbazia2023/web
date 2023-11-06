<template>
  <Story
    title="2. Atoms/Alert"
    icon="material-symbols:data-alert"
    :layout="{ type: 'grid', width: 400}"
  >
    <Variant title="Main alert">
      <PAlert>
        <template #bold-text>
          Using bold text slot :
        </template>
        Lorem ipsum dolor sit amet, consectetur adipiscing
        elit. Sed venenatis quis dolor in consequat. Integer nec viverra dui.
        Quisque eget risus feugiat, pellentesque sem interdum, vehicula eros.
      </PAlert>
    </Variant>

    <Variant title="Success alert">
      <PAlert type="success">
        Not using bold text slot Lorem ipsum dolor sit amet, consectetur adipiscing
        elit. Sed venenatis quis dolor in consequat. Integer nec viverra dui.
        Quisque eget risus feugiat, pellentesque sem interdum, vehicula eros.
      </PAlert>
    </Variant>

    <Variant title="Warning alert">
      <PAlert type="warning">
        Not using bold text slot Lorem ipsum dolor sit amet, consectetur adipiscing
        elit. Sed venenatis quis dolor in consequat. Integer nec viverra dui.
        Quisque eget risus feugiat, pellentesque sem interdum, vehicula eros.
      </PAlert>
    </Variant>

    <Variant title="Danger alert">
      <PAlert type="danger">
        <template #bold-text>
          Using bold text slot :
        </template>
        Lorem ipsum dolor sit amet, consectetur adipiscing
        elit. Sed venenatis quis dolor in consequat. Integer nec viverra dui.
        Quisque eget risus feugiat, pellentesque sem interdum, vehicula eros.
      </PAlert>
    </Variant>

    <Variant title="Information usage">
      <PAlert type="information">
        <template #bold-text>
          Using bold text slot :
        </template>
        Lorem ipsum dolor sit amet, consectetur adipiscing
        elit. Sed venenatis quis dolor in consequat. Integer nec viverra dui.
        Quisque eget risus feugiat, pellentesque sem interdum, vehicula eros.
      </PAlert>
    </Variant>

    <Variant title="Alert Collapse">
      <div class="block-collapse">
        <PCollapse
          v-model="activeNames"
          accordion="false"
        >
          <PCollapseItem
            pType="alert"
            pTitleCollapseItem="Some documents cannot be moved to your document space"
            :pIcon="PIExclamationTriangle"
            name="1"
          >
            <div>
              Content
            </div>
          </PCollapseItem>
          <PCollapseItem
            pType="alert"
            pTitleCollapseItem="Some documents cannot be moved to your document space"
            :pIcon="PIExclamationTriangle"
            name="2"
          >
            <div>
              Content
            </div>
          </PCollapseItem>
        </PCollapse>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PCollapseItem from '@/atoms/PCollapseItem'
import { PIExclamationTriangle } from '@/atoms/PIcon/components'
import PAlert from './'

const activeNames = ref(['1'])
</script>

<style lang="scss">
.block-collapse {
  height: 250px;
  padding: 24px;
}
</style>

<docs lang="md">
## Alert

You can use an optional slot named "bold-text" which is inline with default slot.

<div class="responsive-iframe-container">
<iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D976%253A4853%26mode%3Ddev"></iframe>
</div>
</docs>
