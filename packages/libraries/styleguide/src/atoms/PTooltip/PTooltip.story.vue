<template>
  <Story title="2. Atoms/Tooltip" icon="tabler:tooltip">
    <Variant title="Custom tooltip">
      <PTooltip
        :pContent="tooltipBasicData.content"
        :pPlacement="tooltipBasicData.placement"
        :disabled="tooltipBasicData.disabled"
      >
        <PButton> Hover button </PButton>
      </PTooltip>
      <template #controls>
        <hstText v-model="tooltipBasicData.content" title="content" />
        <hstSelect
          v-model="tooltipBasicData.placement"
          title="placement"
          :options="placementOptions"
        />
        <hstCheckbox v-model="tooltipBasicData.disabled" title="disabled" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import placementOptions from '@/constants/placementOptions'
import PTooltip from './'
import PButton from '@/atoms/PButton'

const tooltipBasicData = reactive({
  placement: placementOptions[0].value,
  content: 'this is a tooltip',
  disabled: false,
})
</script>

<docs lang="md">
  <div>
  Tooltip is used to display prompt information for mouse hover.
  we use attribute content to set the display content when hover.
  The attribute placement determines the position of the tooltip.

## Attributes

    | Name                      | Description                                                                                                                                             | Type                         | Accepted Values                                                                                           | Default                                                                    |
    | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
    | append-to                 | which element the tooltip CONTENT appends to                                                                                                            | `CSSSelector \| HTMLElement` | —                                                                                                         | #el-popper-container-[randomValue]                                         |
    | effect                    | Tooltip theme, built-in theme: `dark` / `light`                                                                                                         | string                       | dark / light                                                                                              | dark                                                                       |
    | pContent                  | display content, can be overridden by `slot#content`                                                                                                    | String                       | —                                                                                                         | —                                                                          |
    | raw-content               | whether `content` is treated as HTML string                                                                                                             | boolean                      | —                                                                                                         | false                                                                      |
    | pPlacement                | position of Tooltip                                                                                                                                     | string                       | top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end | bottom                                                                     |
    | visible / v-model:visible | visibility of Tooltip                                                                                                                                   | boolean                      | —                                                                                                         | false                                                                      |
    | disabled                 | whether Tooltip is disabled                                                                                                                             | boolean                      | —                                                                                                         | false                                                                      |
    | offset                    | offset of the Tooltip                                                                                                                                   | number                       | —                                                                                                         | 0                                                                          |
    | transition                | animation name                                                                                                                                          | string                       | —                                                                                                         | el-fade-in-linear                                                          |
    | popper-options            | [popper.js](https://popper.js.org/docs/v2/) parameters                                                                                                  | Object                       | refer to [popper.js](https://popper.js.org/docs/v2/) doc                                                  | `{modifiers: [{name: 'computeStyles',options: {gpuAcceleration: false}}]}` |
    | show-after                | delay of appearance, in millisecond                                                                                                                     | number                       | —                                                                                                         | 0                                                                          |
    | show-arrow                | whether the tooltip content has an arrow                                                                                                                | boolean                      | true / false                                                                                              | true                                                                       |
    | hide-after                | delay of disappear, in millisecond                                                                                                                      | number                       | —                                                                                                         | 200                                                                        |
    | auto-close                | timeout in milliseconds to hide tooltip                                                                                                                 | number                       | —                                                                                                         | 0                                                                          |
    | manual                    | whether to control Tooltip manually. `mouseenter` and `mouseleave` won't have effects if set to `true`                                                  | boolean                      | —                                                                                                         | false                                                                      |
    | popper-class              | custom class name for Tooltip's popper                                                                                                                  | string                       | —                                                                                                         | —                                                                          |
    | enterable                 | whether the mouse can enter the tooltip                                                                                                                 | Boolean                      | —                                                                                                         | true                                                                       |
    | tabindex                  | [tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) of Tooltip                                                     | number                       | —                                                                                                         | 0                                                                          |
    | teleported                | whether tooltip content is teleported, if `true` it will be teleported to where `append-to` sets                                                        | boolean                      | true / false                                                                                              | true                                                                       |
    | trigger                   | How should the tooltip be triggered (to show)                                                                                                           | string                       | hover / click / focus / contextmenu                                                                       | hover                                                                      |
    | virtual-triggering        | Indicates whether virtual triggering is enabled                                                                                                         | boolean                      | —                                                                                                         | false                                                                      |
    | virtual-ref               | Indicates the reference element to which the tooltip is attached                                                                                        | HTMLElement                  | —                                                                                                         | —                                                                          |
    | trigger-keys              | When you click the mouse to focus on the trigger element, you can define a set of keyboard codes to control the display of tooltip through the keyboard | Array                        | —                                                                                                         | `['Enter','Space']`                                                        |
    <iframe src="https://www.figma.com/file/hycpUsOrc1fFD7xcYY0ryN/%F0%9F%A6%84-Librairie-de-composants?type=design&node-id=984-5556&mode=design&t=WnggowsMqWDcnDrS-0;https://element-plus.org/en-US/component/tooltip.html"></iframe>

  </div>

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D984%253A5059%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
