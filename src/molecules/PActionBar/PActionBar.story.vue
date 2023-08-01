<template>
  <Story
    title="3. Molecules/ActionBar"
    icon="mdi:call-to-action"
    :layout="{ type: 'single', iframe: true }">
    <Variant title="Basic usage simple">
      <PActionBar :rightSideButtons="rightSideIcons" :leftSideButtons="leftSideIcons" />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import PActionBar from '.'
import { ref } from 'vue'

const leftSideIcons = ref([{
  buttonName: 'Déposer un document',
  buttonType: 'primary',
  buttonIcon: 'PIUpload',
  buttonActionName: 'buttonActionName',
  plain: false,
  round: false,
  circle: false,
  loading: false,
  disabled: false,
  size: 'small'
},
{
  buttonName: 'Filtrer',
  buttonType: 'primary',
  buttonIcon: 'PIFunnel',
  buttonActionName: 'buttonActionName',
  plain: true,
  round: false,
  circle: false,
  loading: false,
  disabled: false,
  size: 'small'
},
{
  buttonName: '',
  buttonType: 'white',
  buttonIcon: 'PISearch',
  buttonActionName: 'buttonActionName',
  plain: false,
  round: false,
  circle: true,
  loading: false,
  disabled: false,
  size: 'small'
}
])

const rightSideIcons = ref([{
  buttonName: 'Renommer',
  buttonType: 'white',
  buttonIcon: 'PIPencilSquare',
  buttonActionName: 'buttonActionName',
  plain: true,
  round: false,
  circle: false,
  loading: false,
  disabled: false,
  size: 'small'
},
{
  buttonName: 'Envoi immédiat',
  buttonType: 'white',
  buttonIcon: 'PIRocket',
  buttonActionName: 'buttonActionName',
  plain: true,
  round: false,
  circle: false,
  loading: false,
  disabled: false,
  size: 'small'
},
{
  buttonName: 'Filtrer',
  buttonType: 'white',
  buttonIcon: 'PIFunnel',
  buttonActionName: 'buttonActionName',
  plain: true,
  round: false,
  circle: false,
  loading: false,
  disabled: false,
  size: 'small'
},
{
  buttonName: 'Télécharger',
  buttonType: 'white',
  buttonIcon: 'PIDownload',
  buttonActionName: 'buttonActionName',
  plain: false,
  round: false,
  circle: false,
  loading: false,
  disabled: false,
  size: 'small'
},
{
  buttonName: 'Supprimer',
  buttonType: 'white',
  buttonIcon: 'PITrash',
  buttonActionName: 'buttonActionName',
  plain: false,
  round: false,
  circle: false,
  loading: false,
  disabled: false,
  size: 'small'
},
{
  buttonName: 'Consulter',
  buttonType: 'white',
  buttonIcon: 'PIEye',
  buttonActionName: 'buttonActionName',
  plain: false,
  round: false,
  circle: false,
  loading: false,
  disabled: false,
  size: 'small'
}
])

</script>

<docs lang="md">
# Adding buttons to the action bar layout

You can add buttons to the left or right side of the action bar layout by passing an array of `Buttons` objects to the `rightSideButtons` or `leftSideButtons` props. The `Buttons` type is defined as follows:
```javascript
interface Buttons {
buttonName: string;
buttonType: string;
buttonIcon: string;
buttonActionName: string;
size: string;
plain: Boolean;
round: Boolean;
circle: Boolean;
loading: Boolean;
disabled: Boolean;
}

```
**Example of passed value:**
```javascript
const leftSideIcons = ref([{
buttonName: 'Déposer un document',
buttonType: 'primary',
buttonIcon: 'PIUpload',
buttonActionName: 'buttonActionName',
plain: false,
round: false,
circle: false,
loading: false,
disabled: false
}
])
```

# Buttons type properties
| Property         | Type                | Description                                                                                   | Reference                                                                                                                                                                        |
|------------------|---------------------|-----------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| buttonName       | string              | The text content of the button                                                                |                                                                                                                                                                                  |
| buttonType       | string              | The type of the button. Different button types are mentioned in the PButton story.    | [Figma PButton](https://www.figma.com/embed?embed_host=sastdstorybook.z28.web.core.windows.net&amp;url=https://www.figma.com/file/xcugC6MchXrgyIq6yHrjf7/Librairie?node-id=5373%3A17809)  |
| buttonIcon       | string              | The icon name to display. The icons' names are available in the PIcon story.            | [Figma PIcon](https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D23%253A212%26mode%3Ddev) |
| buttonActionName | string              | The text value of the action that will be emitted                                             |                                                                                                                                                                                  |
| size, plain, round, circle, loading, disabled | Check  PButton story | All of these properties are the PButton properties that define how the buttons will look like inside the action bar | [Figma PButton](https://www.figma.com/embed?embed_host=sastdstorybook.z28.web.core.windows.net&amp;url=https://www.figma.com/file/xcugC6MchXrgyIq6yHrjf7/Librairie?node-id=5373%3A17809)  |

# Max number of buttons that will be displayed
| Right side      | Left side       |
|-----------------|-----------------|
| 5               | 3               |

> **Important Note:** The right-side buttons will transform into icon buttons only when the window size is under 1024.

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D1875%253A11653%26mode%3Ddesign%26t%3DILcI86fQIuF3Yy79-1" allowfullscreen></iframe>
  </div>
</docs>
