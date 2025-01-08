<template>
  <Story title="3. Molecules/Toaster" icon="system-uicons:message">
    <Variant title="Success notification">
      <PButton pPlain @click="openSuccess">
        Success
      </PButton>
    </Variant>

    <Variant title="Error notification">
      <PButton pPlain @click="openError">
        Error
      </PButton>
    </Variant>

    <Variant title="Loading notification">
      <PButton pPlain @click="openLoading">
        Loading
      </PButton>
    </Variant>

    <Variant title="Notification with close button">
      <PButton pPlain @click="openWithClose">
        Open with close button
      </PButton>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PButton from '../../atoms/PButton'
import { PICheck, PIExclamationTriangle, PILoader } from '../../atoms/PIcon/components'
import { PNotification } from '../../utils/PNotification/PNotification'

const openSuccess = () => {
  PNotification({
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    iconName: 'check',
    showClose: false,
    customClass: 'success',
  })
}

const openLoading = () => {
  PNotification({
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    iconName: 'loader',
    showClose: false,
    customClass: 'loading',
  })
}

const openError = () => {
  PNotification({
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    iconName: 'exclamationTriangle',
    customClass: 'error',
    showClose: false,
  })
}

const openWithClose = () => {
  PNotification({
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    iconName: 'check',
    showClose: true,
    customClass: 'success',
    duration: 0,
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
| iconName                 | custom icon component name. It will be overridden by type           | string \| Component  |
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
