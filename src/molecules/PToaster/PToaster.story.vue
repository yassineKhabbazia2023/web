<template>
  <Story title="Molecules/PToaster" icon="radix-icons:margin">
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
import { PICheck, PIExclamationTriangle } from '@/atoms/PIcon/components'

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
    icon: PICheck,
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
</docs>
