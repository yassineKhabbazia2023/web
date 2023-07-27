<template>
  <Story title="3. Molecules/Toaster" icon="system-uicons:message">
    <Variant title="Success notification">
      <PButton plain @click="openSuccess">
        Success
      </PButton>
    </Variant>

    <Variant title="Error notification">
      <PButton plain @click="openError">
        Error
      </PButton>
    </Variant>

    <Variant title="Loading notification">
      <PButton plain @click="openLoading">
        Loading
      </PButton>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import PButton from '@/atoms/PButton'
import { PICheck, PIExclamationTriangle, PILoader } from '@/atoms/PIcon/components'

const toastPlugin = inject('toast')

const openSuccess = () => {
  toastPlugin({
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    icon: PICheck,
    showClose: false,
    customClass: 'success'
  })
}

const openLoading = () => {
  toastPlugin({
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    icon: PILoader,
    showClose: false,
    customClass: 'loading'
  })
}

const openError = () => {
  toastPlugin({
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    icon: PIExclamationTriangle,
    customClass: 'error',
    showClose: false
  })
}
</script>

<docs lang="md">
## Options

| Name                     | Description                                                         | Type                 |
| ------------------------ | ------------------------------------------------------------------- | -------------------- |
| title                    | title                                                               | string               |
| message                  | description text                                                    | string \| VNode      |
| dangerouslyUseHTMLString | whether message is treated as HTML string                           | boolean              |
| type                     | notification type                                                   | enum                 |
| icon                     | custom icon component.It will be overridden by type                 | string \| Component  |
| customClass              | custom class name for Notification (success, error, loading)        | string               |
| duration                 | duration before close. It will not automatically close if set 0     | number               |
| position                 | custom position                                                     | enum                 |
| showClose                | whether to show a close button                                      | boolean              |
| onClose                  | callback function when closed                                       | Function             |
| onClick                  | callback function when notification clicked                         | Function             |
| offset                   | offset from the top edge of the screen.                             | number               |
| appendTo                 | set the root element for the notification, default to document.body | string \|HTMLElement |
| zIndex                   | initial zIndex                                                      | number               |

<div class="responsive-iframe-container">
  <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D1074%253A5511%26mode%3Ddev" allowfullscreen></iframe>
</div>
</docs>
