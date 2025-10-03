import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PActionBar from './PActionBar.vue'
import type { ComponentDefinitionProps } from './PActionBarTypes'
import type { PButtonProps } from '../../atoms/PButton/PButtonTypes'

const meta: Meta<typeof PActionBar> = {
  title: 'Molecules/PActionBar',
  component: PActionBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Action bar component with left and right side buttons support.',
      },
    },
  },
  argTypes: {
    pLeftSideButtons: {
      control: 'object',
      description: 'Array of button definitions for the left side',
    },
    pRightSideButtons: {
      control: 'object',
      description: 'Array of button definitions for the right side',
    },
    pSearchMaxLength: {
      control: 'number',
      description: 'Maximum length for search input',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

function getButton(
  pType: PButtonProps['pType'],
  override: Partial<PButtonProps> = {},
): PButtonProps {
  const defaultButton: PButtonProps = {
    pType,
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

const leftSideButtons: ComponentDefinitionProps[] = [
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
    pButton: getButton('primary'),
  },
  {
    pButtonName: '',
    pButtonIconName: 'search',
    pButtonActionName: 'buttonActionName',
    pComponentType: 'SEARCH',
    pButton: getButton('white', { pCircle: true }),
  },
]

const rightSideButtons: ComponentDefinitionProps[] = [
  {
    pButtonName: 'Renommer',
    pButtonIconName: 'pencilSquare',
    pButtonActionName: 'buttonActionName',
    pButton: getButton('white'),
  },
  {
    pButtonName: 'Envoi immédiat',
    pButtonIconName: 'rocket',
    pButtonActionName: 'buttonActionName',
    pButton: getButton('white'),
  },
  {
    pButtonName: 'Filtrer',
    pButtonIconName: 'funnel',
    pButtonActionName: 'buttonActionName',
    pButton: getButton('white'),
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
]

export const Default: Story = {
  args: {
    pLeftSideButtons: leftSideButtons,
    pRightSideButtons: rightSideButtons,
  },
}

export const OnlyLeftSide: Story = {
  args: {
    pLeftSideButtons: leftSideButtons,
    pRightSideButtons: [],
  },
}
