<template>
  <Story
    title="3. Molecules/ActionBar"
    icon="mdi:call-to-action"
    :layout="{ type: 'single', iframe: true }">
    <Variant title="Basic usage simple">
      <PActionBar :pRightSideButtons="pRightSideIcons" :pLeftSideButtons="pLeftSideIcons" />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { PButtonProps } from '@/atoms/PButton/PButtonTypes'
import PActionBar from '.'

const pLeftSideIcons = reactive([{
  pButtonName: 'Déposer un document',
  pButtonIcon: 'PIUpload',
  pButtonActionName: 'buttonActionName',
  pButton: {
    pType: ref<PButtonProps['pType']>('primary'),
    pPlain: false,
    pRound: false,
    pCircle: false,
    pLoading: false,
    pDisabled: false,
    pSize: ref<PButtonProps['pSize']>('small')
  }
},
{
  pButtonName: 'Filtrer',
  pButtonIcon: 'PIFunnel',
  pButtonActionName: 'buttonActionName',
  pButton: {
    pType: ref<PButtonProps['pType']>('primary'),
    pPlain: true,
    pRound: false,
    pCircle: false,
    pLoading: false,
    pDisabled: false,
    pSize: ref<PButtonProps['pSize']>('small')
  }
},
{
  pButtonName: '',
  pButtonIcon: 'PISearch',
  pButtonActionName: 'buttonActionName',
  pButton: {
    pType: ref<PButtonProps['pType']>('white'),
    pPlain: false,
    pRound: false,
    pCircle: true,
    pLoading: false,
    pDisabled: false,
    pSize: ref<PButtonProps['pSize']>('small')
  }
}
])

const pRightSideIcons = reactive([{
  pButtonName: 'Renommer',
  pButtonIcon: 'PIPencilSquare',
  pButtonActionName: 'buttonActionName',
  pButton: {
    pType: ref<PButtonProps['pType']>('white'),
    pPlain: true,
    pRound: false,
    pCircle: false,
    pLoading: false,
    pDisabled: false,
    pSize: ref<PButtonProps['pSize']>('small')
  }
},
{
  pButtonName: 'Envoi immédiat',
  pButtonIcon: 'PIRocket',
  pButtonActionName: 'buttonActionName',
  pButton: {
    pType: ref<PButtonProps['pType']>('white'),
    pPlain: true,
    pRound: false,
    pCircle: false,
    pLoading: false,
    pDisabled: false,
    pSize: ref<PButtonProps['pSize']>('small')
  }
},
{
  pButtonName: 'Filtrer',
  pButtonIcon: 'PIFunnel',
  pButtonActionName: 'buttonActionName',
  pButton: {
    pType: ref<PButtonProps['pType']>('white'),
    pPlain: true,
    pRound: false,
    pCircle: false,
    pLoading: false,
    pDisabled: false,
    pSize: ref<PButtonProps['pSize']>('small')
  }
},
{
  pButtonName: 'Télécharger',
  pButtonIcon: 'PIDownload',
  pButtonActionName: 'buttonActionName',
  pButton: {
    pType: ref<PButtonProps['pType']>('white'),
    pPlain: false,
    pRound: false,
    pCircle: false,
    pLoading: false,
    pDisabled: false,
    pSize: ref<PButtonProps['pSize']>('small')
  }
},
{
  pButtonName: 'Supprimer',
  pButtonIcon: 'PITrash',
  pButtonActionName: 'buttonActionName',
  pButton: {
    pType: ref<PButtonProps['pType']>('white'),
    pPlain: false,
    pRound: false,
    pCircle: false,
    pLoading: false,
    pDisabled: false,
    pSize: ref<PButtonProps['pSize']>('small')
  }
},
{
  pButtonName: 'Consulter',
  pButtonIcon: 'PIEye',
  pButtonActionName: 'buttonActionName',
  pButton: {
    pType: ref<PButtonProps['pType']>('white'),
    pPlain: false,
    pRound: false,
    pCircle: false,
    pLoading: false,
    pDisabled: false,
    pSize: ref<PButtonProps['pSize']>('small')
  }
}
])

</script>

<docs lang="md">
# Adding buttons to the action bar layout

You can add buttons to the left or right side of the action bar layout by passing an array of `ComponentDefinitionProps` objects to the `rightSideButtons` or `leftSideButtons` props. The `ComponentDefinitionProps` type is defined as follows:
```javascript
export interface PActionBarProps {
  pButtonName: string;
  pButtonIcon: string;
  pButtonActionName: string;
  pButton: PButtonProps
}

```
**Example of passed value:**
```javascript
const pLeftSideIcons = ref([{
  pButtonName: 'Déposer un document',
  pButtonIcon: 'PIUpload',
  pButtonActionName: 'buttonActionName',
  pButton: {
    pType: 'primary',
    pPlain: false,
    pRound: false,
    pCircle: false,
    pLoading: false,
    pDisabled: false
    }
  }
])
```

# Buttons type properties
| Property          | Type                | Description                                                                                   | Reference                                                                                                                                                                        |
|-------------------|---------------------|-----------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| pButtonName       | string              | The text content of the button                                                                |                                                                                                                                                                                  |
| pType             | string              | The type of the button. Different button types are mentioned in the PButton story.    | [Figma PButton](https://www.figma.com/embed?embed_host=sastdstorybook.z28.web.core.windows.net&amp;url=https://www.figma.com/file/xcugC6MchXrgyIq6yHrjf7/Librairie?node-id=5373%3A17809)  |
| pButtonIcon       | string              | The icon name to display. The icons' names are available in the PIcon story.            | [Figma PIcon](https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D23%253A212%26mode%3Ddev) |
| pButtonActionName | string              | The text value of the action that will be emitted                                             |                                                                                                                                                                                  |
| pSize, pPlain, pRound, pCircle, pLoading, pDisabled | Check  PButton story | All of these properties are the PButton properties that define how the buttons will look like inside the action bar | [Figma PButton](https://www.figma.com/embed?embed_host=sastdstorybook.z28.web.core.windows.net&amp;url=https://www.figma.com/file/xcugC6MchXrgyIq6yHrjf7/Librairie?node-id=5373%3A17809)  |

# Max number of buttons that will be displayed
| Right side      | Left side       |
|-----------------|-----------------|
| 5               | 3               |

> **Important Note:** The right-side buttons will transform into icon buttons only when the window size is under 1024.

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D1875%253A11653%26mode%3Ddesign%26t%3DILcI86fQIuF3Yy79-1" allowfullscreen></iframe>
  </div>
</docs>
