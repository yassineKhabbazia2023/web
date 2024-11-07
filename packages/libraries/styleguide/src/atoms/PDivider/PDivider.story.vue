<template>
  <Story
    title="2. Atoms/Divider"
    icon="fluent:divider-tall-16-filled"
    :layout="{ type: 'grid', width: '350px' }"
  >
    <Variant title="Basic Usage">
      <div class="padding--4">
        <PDivider />
      </div>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import PDivider from '.'
</script>

<docs lang="md">
  ## Divider props
  pDirection?: 'horizontal' | 'vertical'
  pBorderStyle?: 'none' | 'solid' | 'hidden' | 'dashed'
  pContentPosition?: 'left' | 'right' | 'center'
  pBorderColor?: string
</docs>
