import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PUserCard from './PUserCard.vue'
import PButton from '../PButton/PButton.vue'
import PIcon from '../PIcon/PIcon.vue'
import PTag from '../PTag/PTag.vue'

const meta: Meta<typeof PUserCard> = {
  title: 'Atoms/PUserCard',
  component: PUserCard as unknown as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: "Carte d'utilisateur avec image ou avatar, tag et actions.",
      },
    },
  },
  argTypes: {
    pImageName: { control: 'text', description: "Nom de l'image" },
    pAvatarContent: { control: 'text', description: "Contenu de l'avatar" },
    pTitle: { control: 'text', description: 'Titre' },
    pSubtitle: { control: 'text', description: 'Sous-titre' },
    pDescription: { control: 'text', description: 'Description' },
    pColor: { control: 'select', options: ['default', 'gray'], description: 'Couleur' },
    pTag: { control: false, description: 'Tag à droite' },
  },
  args: {
    pTitle: 'Name Last Name',
    pSubtitle: 'name.lastname@gmail.com',
    pDescription: "Description de l'utilisateur",
  },
}

export default meta
export type Story = StoryObj<typeof meta>

export const WithImage: Story = {
  render: (args) => ({
    components: { PUserCard, PButton, PIcon },
    setup: () => ({ args }),
    template: `
      <PUserCard v-bind="args" pImageName="user-duotone">
        <PButton pType="default" pSize="small">
          <PIcon class="el-button__icon--left" pName="vectorPen" />
          Désigner un signataire
        </PButton>
      </PUserCard>
    `,
  }),
}

export const GrayWithImage: Story = {
  args: { pColor: 'gray' },
  render: (args) => ({
    components: { PUserCard, PButton, PIcon },
    setup: () => ({ args }),
    template: `
      <PUserCard v-bind="args" pImageName="user-duotone">
        <PButton pType="default" pSize="small">
          <PIcon class="el-button__icon--left" pName="vectorPen" />
          Désigner un signataire
        </PButton>
      </PUserCard>
    `,
  }),
}

export const WithAvatarNoDescription: Story = {
  args: { pAvatarContent: 'AB', pDescription: undefined },
  render: (args) => ({
    components: { PUserCard, PButton, PIcon },
    setup: () => ({ args }),
    template: `
      <PUserCard v-bind="args">
        <PButton pType="primary" pSize="small">
          <PIcon class="el-button__icon--left" pName="add" />
          Appel à l'action
        </PButton>
      </PUserCard>
    `,
  }),
}

export const TagOnRight: Story = {
  render: (args) => ({
    components: { PUserCard, PTag },
    setup: () => ({ args }),
    template: `
      <PUserCard v-bind="args" pImageName="user-duotone">
        <PTag
          pIconLeftName="person"
          pContent="Client"
        />
      </PUserCard>
    `,
  }),
}
