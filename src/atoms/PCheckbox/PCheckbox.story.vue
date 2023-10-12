<template>
  <Story title="2. Atoms/Checkbox" icon="radix-icons:checkbox">
    <Variant title="Checkbox">
      <PCheckbox
        :disabled="checkBoxControl.disabled"
      >
        {{ checkBoxControl.contentSlot }}
      </PCheckbox>
      <template #controls>
        <HstCheckbox v-model="checkBoxControl.disabled" title="Disabled" />
        <HstText v-model="checkBoxControl.contentSlot" title="ContentSlot" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PCheckbox from '.'
import { reactive } from 'vue'
const checkBoxControl = reactive({
  disabled: false,
  contentSlot: 'Checkbox label'
})
</script>

<docs lang="md">
  <div>
    Checkbox can be used alone to switch between two states.

## Attributes

  | Name                  | Description                                                 | Type                               | Default |
  | --------------------- | ----------------------------------------------------------- | ---------------------------------- | ------- |
  | model-value / v-model | binding value                                               | string / number / boolean          | —       |
  | label                 | value of the Checkbox when used inside a checkbox-group     | string / number / boolean / object | —       |
  | true-label            | value of the Checkbox if it's checked                       | string / number                    | —       |
  | false-label           | value of the Checkbox if it's not checked                   | string / number                    | —       |
  | disabled              | whether the Checkbox is disabled                            | boolean                            | false   |
  | border                | whether to add a border around Checkbox                     | boolean                            | false   |
  | size                  | size of the Checkbox                                        | enum                               | —       |
  | name                  | native 'name' attribute                                     | string                             | —       |
  | checked               | if the Checkbox is checked                                  | boolean                            | false   |
  | indeterminate         | Set indeterminate state, only responsible for style control | boolean                            | false   |
  | validate-event        | whether to trigger form validation                          | boolean                            | true    |
  | tabindex              | input tabindex                                              | string / number                    | —       |
  | id                    | input id                                                    | string                             | —       |

  </div>
  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D291%253A2177%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
