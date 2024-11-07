<template>
  <Story
    title="3. Molecules/Popover"
    icon="tabler:tooltip"
  >
    <Variant title="Custom popover">
      <PPopover
        :pPlacement="popoverBasicData.pPlacement"
        :pDisabled="popoverBasicData.pDisabled"
        :pShowArrow="popoverBasicData.pShowArrow"
        :pTrigger="popoverBasicData.pTriggerOptions"
        :pTitle="popoverBasicData.pTitle"
      >
        <template #content>
          {{ popoverBasicData.pContent }}
        </template>
        <PButton>Button</PButton>
      </PPopover>
      <template #controls>
        <hstText v-model="popoverBasicData.pTitle" title="Title" />
        <hstText v-model="popoverBasicData.pContent" title="content" />
        <hstSelect
          v-model="popoverBasicData.pPlacement"
          title="placement"
          :options="placementOptions"
        />
        <hstCheckbox v-model="popoverBasicData.pDisabled" title="disabled" />
        <hstSelect
          v-model="popoverBasicData.pTriggerOptions"
          title="trigger"
          :options="triggerOptions"
        />
        <hstCheckbox v-model="popoverBasicData.pShowArrow" title="show-arrow" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PPopover from './'
import { reactive } from 'vue'
import placementOptions from '@styleguide/constants/placementOptions'
import triggerOptions from '@styleguide/constants/triggerOptions'
import PButton from '@styleguide/atoms/PButton'

const popoverBasicData = reactive({
  pPlacement: placementOptions[0].value,
  pContent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  pDisabled: false,
  pShowArrow: true,
  pTriggerOptions: triggerOptions[0],
  pTitle: 'Title',
})
</script>

<docs lang="md">
  <div>
  Popover is used to display prompt information for mouse hover.
  we use attribute content to set the display content when hover.
  The attribute placement determines the position of the popover.

## Attributes

    | Name                      | Description                                                                                                                                             | Type                         | Accepted Values                                                                                           | Default                                                                    |
    | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
    | effect                    | Popover theme, built-in theme: `dark` / `light`                                                                                                         | string                       | dark / light                                                                                              | dark                                                                       |
    | content                   | display content, can be overridden by `slot#content`                                                                                                    | String                       | —                                                                                                         | —                                                                          |
    | placement                 | position of Popover                                                                                                                                     | string                       | top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end | bottom                                                                     |
    | visible / v-model:visible | visibility of Popover                                                                                                                                   | boolean                      | —                                                                                                         | false                                                                      |
    | disabled                  | whether Popover is disabled                                                                                                                             | boolean                      | —                                                                                                         | false                                                                      |
    | offset                    | offset of the Popover                                                                                                                                   | number                       | —                                                                                                         | 0                                                                          |
    | transition                | animation name                                                                                                                                          | string                       | —                                                                                                         | el-fade-in-linear                                                          |
    | popper-options            | [popper.js](https://popper.js.org/docs/v2/) parameters                                                                                                  | Object                       | refer to [popper.js](https://popper.js.org/docs/v2/) doc                                                  | `{modifiers: [{name: 'computeStyles',options: {gpuAcceleration: false}}]}` |
    | show-after                | delay of appearance, in millisecond                                                                                                                     | number                       | —                                                                                                         | 0                                                                          |
    | show-arrow                | whether the Popover content has an arrow                                                                                                                | boolean                      | true / false                                                                                              | true                                                                       |
    | hide-after                | delay of disappear, in millisecond                                                                                                                      | number                       | —                                                                                                         | 200                                                                        |
    | auto-close                | timeout in milliseconds to hide Popover                                                                                                                 | number                       | —                                                                                                         | 0                                                                          |
    | popper-class              | custom class name for Popover's popper                                                                                                                  | string                       | —                                                                                                         | —                                                                          |
    | tabindex                  | [tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) of Popover                                                     | number                       | —                                                                                                         | 0                                                                          |
    | teleported                | whether Popover content is teleported, if `true` it will be teleported to where `append-to` sets                                                        | boolean                      | true / false                                                                                              | true                                                                       |
    | trigger                   | How should the Popover be triggered (to show)                                                                                                           | string                       | hover / click / focus / contextmenu                                                                       | hover                                                                      |

  </div>

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/file/hycpUsOrc1fFD7xcYY0ryN/%F0%9F%A6%84-Librairie-de-composants?type=design&node-id=2197-8015&mode=design&t=IAkJagBC9HCuePyI-0" allowfullscreen></iframe>
  </div>
</docs>
