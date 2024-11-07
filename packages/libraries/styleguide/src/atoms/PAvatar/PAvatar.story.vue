<template>
  <Story title="2. Atoms/Avatar" icon="clarity:avatar-line">
    <Variant title="Basic usage">
      <div class="demo-type">
        <PAvatar
          :pShape="currentShape"
          :pType="currentType"
          :pColor="currentColor"
          :pSelected="selectedState"
          :pSrc="url"
        />
        <PAvatar
          :pShape="currentShape"
          :pType="currentType"
          :pColor="currentColor"
          :pSelected="selectedState"
        >
          <PIcon>
            <PIPulse />
          </PIcon>
        </PAvatar>
        <PAvatar
          :pShape="currentShape"
          :pType="currentType"
          :pColor="currentColor"
          :pSelected="selectedState"
          pSrc="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        />
        <PAvatar
          :pShape="currentShape"
          :pType="currentType"
          :pColor="currentColor"
          :pSelected="selectedState"
        >
          AB
        </PAvatar>
        <PAvatar
          :pShape="currentShape"
          :pType="currentType"
          pColor="orange"
          :pSelected="selectedState"
        >
          <PIcon>
            <PIPulse />
          </PIcon>
        </PAvatar>
        <PAvatar
          :pShape="currentShape"
          :pType="currentType"
          pColor="persian"
          :pSelected="selectedState"
        >
          <PIcon>
            <PIPulse />
          </PIcon>
        </PAvatar>
        <PAvatar
          :pShape="currentShape"
          :pType="currentType"
          pColor="teal"
          :pSelected="selectedState"
        >
          <PIcon>
            <PIPulse />
          </PIcon>
        </PAvatar>
        <PAvatar
          :pShape="currentShape"
          :pType="currentType"
          pColor="green"
          :pSelected="selectedState"
        >
          <PIcon>
            <PIPulse />
          </PIcon>
        </PAvatar>
        <PAvatar
          :pShape="currentShape"
          :pType="currentType"
          pColor="fuschia"
          :pSelected="selectedState"
        >
          <PIcon>
            <PIPulse />
          </PIcon>
        </PAvatar>
        <PAvatar
          :pShape="currentShape"
          :pType="currentType"
          pColor="gray"
          :pSelected="selectedState"
        >
          <PIcon>
            <PIPulse />
          </PIcon>
        </PAvatar>
        <PAvatar
          :pShape="currentShape"
          :pType="currentType"
          pColor="cyan"
          :pSelected="selectedState"
        >
          <PIcon>
            <PIPulse />
          </PIcon>
        </PAvatar>
        <PAvatar
          :pShape="currentShape"
          :pType="currentType"
          pColor="amethyste"
          :pSelected="selectedState"
        >
          <PIcon>
            <PIPulse />
          </PIcon>
        </PAvatar>
        <PAvatar
          :pShape="currentShape"
          :pType="currentType"
          pColor="white"
          :pSelected="selectedState"
        >
          AB
        </PAvatar>
        <PAvatar
          :pShape="currentShape"
          :pType="currentType"
          pColor="bordered-persian"
          :pSelected="selectedState"
        >
          AB
        </PAvatar>
      </div>
      <template #controls>
        <HstRadio
          v-model="currentShape"
          title="Avatar Shape"
          :options="avatarShapeList"
        />
        <HstRadio
          v-model="currentType"
          title="Avatar Sizes"
          :options="avatarSizeList"
        />
        <HstRadio
          v-model="currentColor"
          title="Avatar Colors"
          :options="avatarColorList"
        />
        <HstCheckbox
          v-if="currentType === 'small'"
          v-model="selectedState"
          title="Avatar Selected State"
        />
      </template>
    </Variant>
    <Variant title="Fit Container">
      <PAvatar
        pShape="square"
        pType="large"
        :pFit="currentFit"
        pSrc="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
      />
      <template #controls>
        <HstRadio
          v-model="currentFit"
          title="Avatar Fit"
          :options="fitList"
        />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PAvatarProps } from './PAvatarTypes'
import PAvatar from './'
import { PIPulse } from '../PIcon/components'

const url = ref('https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png')
const avatarShapeList: { label: string, value: PAvatarProps['pShape'] }[] = [
  {
    label: 'circle',
    value: 'circle',
  },
  {
    label: 'square',
    value: 'square',
  },
]
const avatarSizeList: { label: string, value: PAvatarProps['pType'] }[] = [
  {
    label: 'xlarge',
    value: 'xlarge',
  },
  {
    label: 'large',
    value: 'large',
  },
  {
    label: 'default',
    value: 'default',
  },
  {
    label: 'small',
    value: 'small',
  },
  {
    label: 'xsmall',
    value: 'xsmall',
  },
]
const fitList: { label: string, value: PAvatarProps['pFit'] }[] = [
  {
    label: 'fill',
    value: 'fill',
  },
  {
    label: 'contain',
    value: 'contain',
  },
  {
    label: 'cover',
    value: 'cover',
  },
  {
    label: 'none',
    value: 'none',
  },
  {
    label: 'scale-down',
    value: 'scale-down',
  },
]
const avatarColorList: { label: string, value: PAvatarProps['pColor'] }[] = [
  {
    label: 'persian-gradient',
    value: 'persian-gradient',
  },
  {
    label: 'orange',
    value: 'orange',
  },
  {
    label: 'persian',
    value: 'persian',
  },
  {
    label: 'teal',
    value: 'teal',
  },
  {
    label: 'green',
    value: 'green',
  },
  {
    label: 'fuschia',
    value: 'fuschia',
  },
  {
    label: 'gray',
    value: 'gray',
  },
  {
    label: 'white',
    value: 'white',
  },
  {
    label: 'cyan',
    value: 'cyan',
  },
  {
    label: 'amethyste',
    value: 'amethyste',
  },
  {
    label: 'bordered-persian',
    value: 'bordered-persian',
  },
]
const currentShape = ref<PAvatarProps['pShape']>('circle')
const currentType = ref<PAvatarProps['pType']>('default')
const currentFit = ref<PAvatarProps['pFit']>('cover')
const currentColor = ref<PAvatarProps['pColor']>('persian-gradient')
const selectedState = ref<PAvatarProps['pSelected']>(false)

</script>

<style lang="scss">
.demo-type {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>

<docs lang="md">
  ## Basic usage

  Use shape and size prop to set avatar's shape and size.

  ## Types

  It supports images, Icons, or characters.

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D241%253A826%26mode%3Ddev" allowfullscreen></iframe>
  </div>
  ## Fallback

  fallback when image load error.

  ## Fit Container

  Set how the image fit its container for an image avatar,
  same as [object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit).
</docs>
