<template>
  <Story title="Atoms/Checkbox" icon="radix-icons:checkbox">
    <Variant title="Checkbox">
      <PCheckbox
      :disabled="checkBoxControl.disabled">
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

<!-- eslint-disable max-len -->
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

  <iframe src="https://www.figma.com/file/hycpUsOrc1fFD7xcYY0ryN/%F0%9F%A6%84-Librairie-de-composants?type=design&node-id=296-518&mode=design&t=xDfPHUwiAJQULwGQ-0"></iframe>

  </div>
</docs>
<!-- eslint-enable max-len -->.
