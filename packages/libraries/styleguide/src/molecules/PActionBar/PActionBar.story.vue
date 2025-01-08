<template>
  <Story
    title="3. Molecules/ActionBar"
    icon="mdi:call-to-action"
    :layout="{ type: 'single', iframe: true }"
  >
    <Variant title="Basic usage simple">
      <PActionBar
        :pLeftSideButtons="pLeftSideIcons"
        :pRightSideButtons="pRightSideIcons2"
        @p-upload-files-selected="logEvent('p-upload-files-selected', $event)"
        @p-action-bar-button-clicked="logEvent('p-action-bar-button-clicked', $event)"
        @p-search-input="logEvent('p-search-input', $event)"
        @search-expand-change="logEvent('search-expand-change', $event)"
      />
    </Variant>
    <Variant title="Basic usage simple without right side buttons">
      <PActionBar
        :pLeftSideButtons="pLeftSideIcons"
        :pRightSideButtons="pRightSideIcons"
      />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { logEvent } from 'histoire/client'
import type { ComponentDefinitionProps } from './PActionBarTypes'
import PActionBar from '.'
import { PButtonProps } from '../../atoms/PButton/PButtonTypes'

function getButton(
  pType: PButtonProps['pType'],
  override: Partial<PButtonProps> = {},
): PButtonProps {
  const defaultButton: PButtonProps = {
    pType,
    pPlain: false,
    pRound: false,
    pCircle: false,
    pLoading: false,
    pDisabled: false,
    pSize: 'small',
  }

  return {
    ...defaultButton,
    ...override,
  }
}

const pLeftSideIcons = reactive<ComponentDefinitionProps[]>([
  {
    pButtonName: 'Déposer un document',
    pButtonIconName: 'upload',
    pButtonActionName: 'buttonActionName',
    pComponentType: 'UPLOAD',
    pMultiple: true,
    pButton: getButton('primary'),
  },
  {
    pButtonName: 'Filtrer',
    pButtonIconName: 'funnel',
    pButtonActionName: 'buttonActionName',
    pButton: getButton('primary', { pPlain: true }),
  },
  {
    pButtonName: '',
    pButtonIconName: 'search',
    pButtonActionName: 'buttonActionName',
    pComponentType: 'SEARCH',
    pButton: getButton('white', { pCircle: true }),
  },
])

const pRightSideIcons2 = reactive<ComponentDefinitionProps[]>([
  {
    pButtonName: 'Renommer',
    pButtonIconName: 'pencilSquare',
    pButtonActionName: 'buttonActionName',
    pButton: getButton('white', { pPlain: true }),
  },
  {
    pButtonName: 'Envoi immédiat',
    pButtonIconName: 'rocket',
    pButtonActionName: 'buttonActionName',
    pButton: getButton('white', { pPlain: true }),
  },
  {
    pButtonName: 'Filtrer',
    pButtonIconName: 'funnel',
    pButtonActionName: 'buttonActionName',
    pButton: getButton('white', { pPlain: true }),
  },
  {
    pButtonName: 'Télécharger',
    pButtonIconName: 'download',
    pButtonActionName: 'buttonActionName',
    pButton: getButton('white'),
  },
  {
    pButtonName: 'Supprimer',
    pButtonIconName: 'trash',
    pButtonActionName: 'buttonActionName',
    pButton: getButton('white'),
  },
  {
    pButtonName: 'Consulter',
    pButtonIconName: 'eye',
    pButtonActionName: 'buttonActionName',
    pButton: getButton('white'),
  },
])
const pRightSideIcons = reactive<ComponentDefinitionProps[]>([])
</script>

<docs lang="md">
# Adding buttons to the action bar layout

You can add buttons to the left or right side of the action bar layout by passing an array of `ComponentDefinitionProps` objects to the `rightSideButtons` or `leftSideButtons` props. The `ComponentDefinitionProps` type is defined as follows:
```javascript
export interface PActionBarProps {
  pButtonName: string;
  pButtonIconName: IconName;
  pButtonActionName: string;
  pButton: PButtonProps
}

export interface ComponentDefinitionProps extends PButtonActionBarProps {
  componentType?: ComponentType,
  multiple?: boolean
}

```
**Example of passed value:**
```javascript
const pLeftSideIcons = ref([{
  pButtonName: 'Déposer un document',
  pButtonIconName: 'upload',
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
| pButtonIconName   | IconName            | The icon name to display. The icons' names are available in the PIcon story.            | [Figma PIcon](https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D23%253A212%26mode%3Ddev) |
| pButtonActionName | string              | The text value of the action that will be emitted                                             |                                                                                                                                                                                  |
| pSize, pPlain, pRound, pCircle, pLoading, pDisabled | Check  PButton story | All of these properties are the PButton properties that define how the buttons will look like inside the action bar | [Figma PButton](https://www.figma.com/embed?embed_host=sastdstorybook.z28.web.core.windows.net&amp;url=https://www.figma.com/file/xcugC6MchXrgyIq6yHrjf7/Librairie?node-id=5373%3A17809)  |
| componentType     | ComponentType   | It is used to specify which component to render, could be PButton, UploadComponent, or other       |                                                                                                                  |
| multiple          | boolean         | When the componentType is 'UPLOAD', this prop is to specify whether we can perform multiple file selections or not |                                                                                                                  |

# Max number of buttons that will be displayed
| Right side      | Left side       |
|-----------------|-----------------|
| 5               | 3               |

> **Important Note:** The right-side buttons will transform into icon buttons only when the window size is under 1024.

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D1875%253A11653%26mode%3Ddesign%26t%3DILcI86fQIuF3Yy79-1" allowfullscreen></iframe>
  </div>
</docs>
