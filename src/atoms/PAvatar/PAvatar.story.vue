<template>
  <Story title="2. Atoms/Avatar" icon="clarity:avatar-line">
    <Variant title="Basic usage">
      <div class="demo-type">
        <PAvatar
          :shape="currentShape"
          :size="currentSize"
          :color="currentColor"
          :src="url" />
        <PAvatar
          :shape="currentShape"
          :size="currentSize"
          :color="currentColor">
          <PIcon>
            <PIPulse />
          </PIcon>
        </PAvatar>
        <PAvatar
          :shape="currentShape"
          :size="currentSize"
          :color="currentColor"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
        <PAvatar
          :shape="currentShape"
          :size="currentSize"
          :color="currentColor"> AB </PAvatar>
        <PAvatar
          :shape="currentShape"
          :size="currentSize"
          color="orange">
          <PIcon>
            <PICupHot />
          </PIcon>
        </PAvatar>
        <PAvatar
          :shape="currentShape"
          :size="currentSize"
          color="persian">
          <PIcon>
            <PIShop />
          </PIcon>
        </PAvatar>
        <PAvatar
          :shape="currentShape"
          :size="currentSize"
          color="teal">
          <PIcon>
            <PICupStraw />
          </PIcon>
        </PAvatar>
        <PAvatar
          :shape="currentShape"
          :size="currentSize"
          color="green">
          <PIcon>
            <PIFlower />
          </PIcon>
        </PAvatar>
        <PAvatar
          :shape="currentShape"
          :size="currentSize"
          color="fuschia">
          <PIcon>
            <PIScissors />
          </PIcon>
        </PAvatar>
        <PAvatar
          :shape="currentShape"
          :size="currentSize"
          color="gray">
          <PIcon>
            <PITruck />
          </PIcon>
        </PAvatar>
      </div>
      <template #controls>
        <HstRadio
          v-model="currentShape"
          title="Avatar Shape"
          :options="avatarShapeList" />
        <HstRadio
          v-model="currentSize"
          title="Avatar Sizes"
          :options="avatarSizeList" />
        <HstRadio
          v-model="currentColor"
          title="Avatar Colors"
          :options="avatarColorList" />
      </template>
    </Variant>
    <Variant title="Fit Container">
      <PAvatar
        shape="square"
        :size="100"
        :fit="currentFit"
        *
        src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" />
      <template #controls>
        <HstRadio
          v-model="currentFit"
          title="Avatar Fit"
          :options="fitList" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { AvatarProps } from 'element-plus'
import PAvatar from './'

const url = ref('https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png')
const avatarShapeList: { label: string; value: AvatarProps['shape'] }[] = [
  {
    label: 'circle',
    value: 'circle'
  },
  {
    label: 'square',
    value: 'square'
  }
]
const avatarSizeList: { label: string; value: AvatarProps['size'] }[] = [
  {
    label: 'xlarge',
    value: 'xlarge'
  },
  {
    label: 'large',
    value: 'large'
  },
  {
    label: 'default',
    value: 'default'
  },
  {
    label: 'small',
    value: 'small'
  },
  {
    label: 'xsmall',
    value: 'xsmall'
  }
]
const fitList: { label: string; value: AvatarProps['fit'] }[] = [
  {
    label: 'fill',
    value: 'fill'
  },
  {
    label: 'contain',
    value: 'contain'
  },
  {
    label: 'cover',
    value: 'cover'
  },
  {
    label: 'none',
    value: 'none'
  },
  {
    label: 'scale-down',
    value: 'scale-down'
  }
]
const avatarColorList: { label: string; value: 'color' }[] = [
  {
    label: 'persian-gradient',
    value: 'persian-gradient'
  },
  {
    label: 'orange',
    value: 'orange'
  },
  {
    label: 'persian',
    value: 'persian'
  },
  {
    label: 'teal',
    value: 'teal'
  },
  {
    label: 'green',
    value: 'green'
  },
  {
    label: 'fuschia',
    value: 'fuschia'
  },
  {
    label: 'gray',
    value: 'gray'
  }
]
const currentShape = ref<AvatarProps['shape']>('circle')
const currentSize = ref<AvatarProps['size']>('default')
const currentFit = ref<AvatarProps['fit']>('cover')
const currentColor = ref<['color']>('persian-gradient')
</script>

<style lang="scss">
.demo-type {
  display: flex;
  flex-wrap: wrap;
  .el-avatar {
    margin: 0 8px 8px 0;
  }
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
