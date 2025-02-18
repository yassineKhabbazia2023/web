<template>
  <Story
    title="2. Atoms/EmailInputField"
    icon="radix-icons:envelope-closed"
  >
    <Variant title="Basic Usage">
      <PEmailInputField
        v-model="emailInputFieldControl.modelValue"
        :pLocalPartPlaceholder="emailInputFieldControl.pLocalPartPlaceholder"
        :pDomainPartPlaceholder="emailInputFieldControl.pDomainPartPlaceholder"
        :pLocalPartDisabled="emailInputFieldControl.pLocalPartDisabled"
        :pDomainPartDisabled="emailInputFieldControl.pDomainPartDisabled"
      />
      <template #controls>
        <HstText
          v-model="emailInputFieldControl.pLocalPartPlaceholder"
          title="Local Part Placeholder"
        />
        <HstText
          v-model="emailInputFieldControl.pDomainPartPlaceholder"
          title="Domain Part Placeholder"
        />
        <HstCheckbox
          v-model="emailInputFieldControl.pLocalPartDisabled"
          title="Local Part Disabled"
        />
        <HstCheckbox
          v-model="emailInputFieldControl.pDomainPartDisabled"
          title="Domain Part Disabled"
        />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import PEmailInputField from '.'

const emailInputFieldControl = reactive({
  modelValue: '',
  pDefaultDomainPart: 'test.com',
  pLocalPartPlaceholder: '',
  pDomainPartPlaceholder: '',
  pLocalPartDisabled: false,
  pDomainPartDisabled: false,
})
</script>

<docs lang="md">
  <div>
    PEmailInputField is a component that displays an email input split into two parts, with an '@' symbol in the middle, allowing users to easily input and visualize email addresses.

## Attributes

| Name                   | Description                                                | Type            | Default |
| ---------------------- | ---------------------------------------------------------- | --------------- | ------- |
| model-value / v-model  | Binding value                                              | string / number | —       |
| pDefaultDomainPart     | The default domain part when the domain part is not filled | string / number | —       |
| pLocalPartPlaceholder  | The placeholder text for the local part of the email       | string / number | —       |
| pDomainPartPlaceholder | The placeholder text for the domain part of the email      | string / number | —       |
| pLocalPartDisabled     | A flag to disable the local part input field               | boolean         | false   |
| pDomainPartDisabled    | A flag to disable the domain part input field              | boolean         | false   |

  </div>
  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/design/ZB75crMgyOcdlhKZrUlypm/%F0%9F%A6%84-Librairie-de-composants?node-id=2-4&m=dev&t=z1oatR8KpawVD8Dg-1" allowfullscreen></iframe>
  </div>
</docs>
