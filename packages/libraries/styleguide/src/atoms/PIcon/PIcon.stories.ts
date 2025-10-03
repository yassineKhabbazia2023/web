import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PIcon from './PIcon.vue'
import type { IconName } from '../../types/IconName.types'
import { pulseGeneratedIcons } from './components/constants'

// Extract all icon names from pulseGeneratedIcons
const allIconNames: IconName[] = pulseGeneratedIcons.map(icon => icon.name)

const meta: Meta<typeof PIcon> = {
  title: 'Atoms/PIcon',
  component: PIcon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Composant d\'icône basé sur Element Plus avec gestion dynamique des icônes.',
      },
    },
  },
  argTypes: {
    pName: {
      control: 'select',
      options: allIconNames,
      description: 'Nom de l\'icône à afficher',
    },
    pColor: {
      control: 'select',
      description: 'Couleur de l\'icône',
      options: [
        '#0E0F30',
        '#ADB5BD',
        '#fff',
        '#DEE2E6',
        '#B10303',
        '#BB5502',
        '#126778',
        '#3438C5',
        '#0A710B',
        '#0E0F30',
        '#1AAB8E',
        '#0C4F41',
        '#093C32',
      ],
    },
    pSize: {
      control: 'text',
      description: 'Taille de l\'icône (px, em, rem, etc.)',
    },
  },
  args: {
    pName: 'house',
    pColor: undefined,
    pSize: undefined,
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  render: (args) => ({
    components: { PIcon },
    setup() {
      return { args }
    },
    template: '<PIcon v-bind="args" />',
  }),
  parameters: {
    docs: {
      description: {
        story: 'Icône par défaut avec le nom "house".',
      },
    },
  },
}

// Different sizes
export const Sizes: Story = {
  render: () => ({
    components: { PIcon },
    template: `
      <div style="display: flex; align-items: center; gap: 16px;">
        <PIcon pName="star" pSize="12px" />
        <PIcon pName="star" pSize="16px" />
        <PIcon pName="star" pSize="24px" />
        <PIcon pName="star" pSize="32px" />
        <PIcon pName="star" pSize="48px" />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Différentes tailles d\'icônes : 12px, 16px, 24px, 32px, 48px.',
      },
    },
  },
}

// Different colors
export const Colors: Story = {
  render: () => ({
    components: { PIcon },
    template: `
      <div style="display: flex; align-items: center; gap: 16px;">
        <PIcon pName="star" pColor="#126778" pSize="24px" />
        <PIcon pName="star" pColor="#3438C5" pSize="24px" />
        <PIcon pName="star" pColor="#0A710B" pSize="24px" />
        <PIcon pName="star" pColor="#0E0F30" pSize="24px" />
        <PIcon pName="star" pColor="#0C4F41" pSize="24px" />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Icônes avec différentes couleurs personnalisées.',
      },
    },
  },
}

// Common icons showcase
export const CommonIcons: Story = {
  render: () => ({
    components: { PIcon },
    template: `
      <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 24px; align-items: center; text-align: center;">
        <div><PIcon pName="house" pSize="24px" /><br><small>house</small></div>
        <div><PIcon pName="person" pSize="24px" /><br><small>person</small></div>
        <div><PIcon pName="search" pSize="24px" /><br><small>search</small></div>
        <div><PIcon pName="gear" pSize="24px" /><br><small>gear</small></div>
        <div><PIcon pName="bell" pSize="24px" /><br><small>bell</small></div>
        <div><PIcon pName="star" pSize="24px" /><br><small>star</small></div>
        <div><PIcon pName="starFill" pSize="24px" /><br><small>starFill</small></div>
        <div><PIcon pName="check" pSize="24px" /><br><small>check</small></div>
        <div><PIcon pName="x" pSize="24px" /><br><small>x</small></div>
        <div><PIcon pName="infoCircle" pSize="24px" /><br><small>infoCircle</small></div>
        <div><PIcon pName="checkCircle" pSize="24px" /><br><small>checkCircle</small></div>
        <div><PIcon pName="xCircle" pSize="24px" /><br><small>xCircle</small></div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Galerie des icônes les plus couramment utilisées.',
      },
    },
  },
}

// All variants showcase
export const AllVariants: Story = {
  render: () => ({
    components: { PIcon },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px;">
        <div>
          <h3 style="margin-bottom: 16px;">Tailles</h3>
          <div style="display: flex; align-items: center; gap: 16px;">
            <PIcon pName="star" pSize="12px" />
            <PIcon pName="star" pSize="16px" />
            <PIcon pName="star" pSize="24px" />
            <PIcon pName="star" pSize="32px" />
            <PIcon pName="star" pSize="48px" />
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 16px;">Couleurs</h3>
          <div style="display: flex; align-items: center; gap: 16px;">
            <PIcon pName="star" pColor="#0C4F41" pSize="24px" />
            <PIcon pName="star" pColor="#3438C5" pSize="24px" />
            <PIcon pName="star" pColor="#0A710B" pSize="24px" />
            <PIcon pName="star" pColor="#0E0F30" pSize="24px" />
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 16px;">Icônes courantes</h3>
          <div style="display: flex; align-items: center; gap: 16px;">
            <PIcon pName="house" pSize="24px" />
            <PIcon pName="person" pSize="24px" />
            <PIcon pName="search" pSize="24px" />
            <PIcon pName="gear" pSize="24px" />
            <PIcon pName="bell" pSize="24px" />
            <PIcon pName="star" pSize="24px" />
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Aperçu complet de toutes les variantes du composant PIcon.',
      },
    },
  },
}

// All available icons
export const AllAvailableIcons: Story = {
  render: () => ({
    components: { PIcon },
    setup() {
      // Group icons by category
      const iconsByCategory = pulseGeneratedIcons.reduce((acc, icon) => {
        if (!acc[icon.category]) {
          acc[icon.category] = []
        }
        acc[icon.category].push(icon)
        return acc
      }, {} as Record<string, typeof pulseGeneratedIcons>)

      // Sort categories alphabetically, but put "Essentials" first
      const sortedCategories = Object.keys(iconsByCategory).sort((a, b) => {
        if (a === 'Essentials') {
          return -1
        }
        if (b === 'Essentials') {
          return 1
        }
        return a.localeCompare(b)
      })

      return { iconsByCategory, sortedCategories, totalIcons: pulseGeneratedIcons.length }
    },
    template: `
      <div style="padding: 20px;">
        <h2 style="margin-bottom: 24px; color: #333; font-family: system-ui;">
          Toutes les icônes disponibles ({{ totalIcons }} icônes)
        </h2>
        
        <div v-for="category in sortedCategories" :key="category" style="margin-bottom: 48px;">
          <h3 style="margin-bottom: 16px; color: #1f2937; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
            {{ category }} ({{ iconsByCategory[category].length }} icônes)
          </h3>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px;">
            <div 
              v-for="icon in iconsByCategory[category]" 
              :key="icon.name"
              style="display: flex; flex-direction: column; align-items: center; padding: 16px 8px; border: 1px solid #e2e8f0; border-radius: 8px; background: #fafafa; transition: all 0.2s ease; cursor: pointer;"
              @mouseover="$event.currentTarget.style.background = '#f1f5f9'; $event.currentTarget.style.borderColor = '#cbd5e1'"
              @mouseleave="$event.currentTarget.style.background = '#fafafa'; $event.currentTarget.style.borderColor = '#e2e8f0'"
            >
              <PIcon :pName="icon.name" pSize="24px" style="margin-bottom: 8px;" />
              <small style="font-size: 10px; text-align: center; word-break: break-word; color: #64748b; font-family: monospace;">
                {{ icon.name }}
              </small>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Catalogue complet de toutes les icônes disponibles dans le système de design.',
      },
    },
  },
}
