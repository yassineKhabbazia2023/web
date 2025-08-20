import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import PBlockHeader from './PBlockHeader.vue'
import PButton from '../../atoms/PButton'
import PIcon from '../../atoms/PIcon'
import PAutocomplete from '../../molecules/PAutocomplete'

const meta: Meta<typeof PBlockHeader> = {
  title: 'Molecules/PBlockHeader',
  component: PBlockHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Composant d\'en-tête de bloc avec titre, description, image et bouton optionnel.',
      },
    },
  },
  argTypes: {
    pTitle: { control: 'text', description: 'Titre du bloc' },
    pDescription: { control: 'text', description: 'Description du bloc' },
    pSize: {
      control: 'select',
      options: ['default', 'big'],
      description: 'Taille du bloc',
    },
    pColor: {
      control: 'select',
      options: ['gray', 'persian'],
      description: 'Couleur de fond du bloc',
    },
    pHasButton: { control: 'boolean', description: 'Affiche ou cache la zone de bouton' },
    pImage: {
      control: 'object',
      description: 'Configuration de l\'image (nom et ajustement)',
    },
  },
  args: {
    pTitle: 'Add collaborators',
    pDescription: 'You can add collaborators on this offer.',
    pSize: 'default',
    pColor: 'persian',
    pHasButton: false,
    pImage: {
      pFit: 'fill',
      pName: 'user-add-duotone',
    },
  },
}

export default meta
export type Story = StoryObj<typeof meta>

// Basic gray variant
export const Gray: Story = {
  args: {
    pTitle: 'Block Header',
    pDescription: 'This is a basic gray block header without button.',
    pColor: 'gray',
    pHasButton: false,
  },
  render: (args) => ({
    components: { PBlockHeader },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 100%; max-width: 800px;">
        <PBlockHeader v-bind="args" />
      </div>
    `,
  }),
}

// Persian variant with button
export const PersianWithButton: Story = {
  args: {
    pTitle: 'Add collaborators',
    pDescription: 'You can add collaborators on this offer.',
    pColor: 'persian',
    pHasButton: true,
  },
  render: (args) => ({
    components: { PBlockHeader, PButton, PIcon },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 100%; max-width: 800px;">
        <PBlockHeader v-bind="args">
          <PButton pType="primary" pSize="small">
            Activate
            <PIcon class="el-button__icon--right" pName="arrowRight" />
          </PButton>
        </PBlockHeader>
      </div>
    `,
  }),
}

// Big variant with button
export const Big: Story = {
  args: {
    pTitle: 'Add collaborators',
    pDescription: 'You can add collaborators on this offer.',
    pColor: 'persian',
    pSize: 'big',
    pHasButton: true,
  },
  render: (args) => ({
    components: { PBlockHeader, PButton, PIcon },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 100%; max-width: 800px;">
        <PBlockHeader v-bind="args">
          <PButton pType="default" pSize="small">
            <PIcon class="el-button__icon--left" pName="pencilSquare" />
            Note
          </PButton>
        </PBlockHeader>
      </div>
    `,
  }),
}

// With suffix slot
export const WithSuffix: Story = {
  args: {
    pTitle: 'Add collaborators',
    pDescription: 'You can add collaborators on this offer.',
    pColor: 'persian',
    pSize: 'big',
    pHasButton: true,
  },
  render: (args) => ({
    components: { PBlockHeader, PAutocomplete, PIcon },
    setup() {
      const selectedCollaborator = ref(null)
      const collaboratorsTestData = [
        { value: 'Mickaël BELLANGER - toto@test.fr - (ESC, Bureau Y)', link: 'Collab1' },
        { value: 'Clémentine MICKELLE - toto@test.fr - (ESC, Bureau Y)', link: 'Collab2' },
        { value: 'Mickey Oussama - toto@test.fr - (ESC, Bureau Y)', link: 'Collab13' },
      ]

      const querySearch = (queryString: string, cb: (results: any[]) => void) => {
        const results = queryString
          ? collaboratorsTestData.filter(item =>
            item.value.toLowerCase().includes(queryString.toLowerCase()),
          )
          : collaboratorsTestData
        cb(results)
      }

      return { args, selectedCollaborator, querySearch }
    },
    template: `
      <div style="width: 100%; max-width: 800px;">
        <PBlockHeader v-bind="args">
          <template #suffix>
            <p class="margin-bottom--2 font-small font-semibold">
              Veuillez rechercher un collaborateur :
            </p>
            <PAutocomplete
              v-model="selectedCollaborator"
              pPlaceholder="Sélectionner un ou plusieurs collaborateurs"
              :pFetchSuggestions="querySearch"
              pClearable
            >
              <template #prefix>
                <PIcon pName="search" />
              </template>
            </PAutocomplete>
          </template>
        </PBlockHeader>
      </div>
    `,
  }),
}

// With subtitle slot
export const WithSubtitle: Story = {
  args: {
    pTitle: 'Add collaborators',
    pDescription: 'You can add collaborators on this offer.',
    pColor: 'persian',
    pSize: 'big',
    pHasButton: true,
  },
  render: (args) => ({
    components: { PBlockHeader },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 100%; max-width: 800px;">
        <PBlockHeader v-bind="args">
          <template #subtitle>
            <ul class="list-style-none">
              <li>Item A</li>
              <li>Item B</li>
              <li>Item C</li>
            </ul>
          </template>
        </PBlockHeader>
      </div>
    `,
  }),
}

// Without image
export const WithoutImage: Story = {
  args: {
    pTitle: 'Simple Block Header',
    pDescription: 'A block header without an image.',
    pColor: 'gray',
    pSize: 'default',
    pHasButton: false,
    pImage: undefined,
  },
  render: (args) => ({
    components: { PBlockHeader },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 100%; max-width: 800px;">
        <PBlockHeader v-bind="args" />
      </div>
    `,
  }),
}
