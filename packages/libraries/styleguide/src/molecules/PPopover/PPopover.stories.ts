import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { reactive } from 'vue'
import PPopover from './PPopover.vue'
import PButton from '../../atoms/PButton'
import type { PPopoverProps } from './PPopoverTypes'
import type { PlacementOptions } from '../../constants/placementOptions'
import type { TriggerOptionsType } from '../../constants/triggerOptions'

const meta: Meta<typeof PPopover> = {
  title: 'Molecules/PPopover',
  component: PPopover,
  parameters: {
    docs: {
      description: {
        component: 'A popover component that displays prompt information on user interaction. Based on Element Plus Popover with custom styling.',
      },
    },
  },
  argTypes: {
    pPlacement: {
      control: 'select',
      options: [
        'top', 'top-start', 'top-end',
        'right', 'right-start', 'right-end',
        'bottom', 'bottom-start', 'bottom-end',
        'left', 'left-start', 'left-end',
      ],
      description: 'Position of the popover',
      table: {
        type: { summary: 'PlacementOptions' },
        defaultValue: { summary: 'bottom' },
      },
    },
    pDisabled: {
      control: 'boolean',
      description: 'Whether the popover is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    pShowArrow: {
      control: 'boolean',
      description: 'Whether to show the arrow',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    pTrigger: {
      control: 'select',
      options: ['hover', 'click', 'focus', 'contextmenu'],
      description: 'How the popover is triggered',
      table: {
        type: { summary: 'TriggerOptionsType' },
        defaultValue: { summary: 'hover' },
      },
    },
    pTitle: {
      control: 'text',
      description: 'Title of the popover',
      table: {
        type: { summary: 'string' },
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PPopover>

export const Default: Story = {
  render: (args: PPopoverProps) => ({
    components: { PPopover, PButton },
    setup() {
      return {
        args,
      }
    },
    template: `
      <div style="padding: 40px; text-align: center;">
        <PPopover v-bind="args">
          <template #content>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
          </template>
          <PButton>Hover me</PButton>
        </PPopover>
      </div>
    `,
  }),
  args: {
    pPlacement: 'top',
    pDisabled: false,
    pShowArrow: true,
    pTrigger: 'hover',
    pTitle: 'Popover Title',
  },
}

export const ClickTrigger: Story = {
  render: (args: PPopoverProps) => ({
    components: { PPopover, PButton },
    setup() {
      return {
        args,
      }
    },
    template: `
      <div style="padding: 40px; text-align: center;">
        <PPopover v-bind="args">
          <template #content>
            This popover is triggered by clicking the button. Click outside to close.
          </template>
          <PButton pType="primary">Click me</PButton>
        </PPopover>
      </div>
    `,
  }),
  args: {
    pPlacement: 'bottom',
    pDisabled: false,
    pShowArrow: true,
    pTrigger: 'click',
    pTitle: 'Click Trigger',
  },
}

export const FocusTrigger: Story = {
  render: (args: PPopoverProps) => ({
    components: { PPopover, PButton },
    setup() {
      return {
        args,
      }
    },
    template: `
      <div style="padding: 40px; text-align: center;">
        <PPopover v-bind="args">
          <template #content>
            This popover appears when the button receives focus. Use Tab to focus or click.
          </template>
          <PButton>Focus me</PButton>
        </PPopover>
      </div>
    `,
  }),
  args: {
    pPlacement: 'right',
    pDisabled: false,
    pShowArrow: true,
    pTrigger: 'focus',
    pTitle: 'Focus Trigger',
  },
}

export const AllPlacements: Story = {
  render: (_args: PPopoverProps) => ({
    components: { PPopover, PButton },
    setup() {
      const placements: PlacementOptions[] = [
        'top', 'top-start', 'top-end',
        'left', 'left-start', 'left-end',
        'right', 'right-start', 'right-end',
        'bottom', 'bottom-start', 'bottom-end',
      ]

      return {
        placements,
      }
    },
    template: `
      <div style="padding: 60px;">
        <h3 style="text-align: center; margin-bottom: 40px;">All Popover Placements</h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 600px; margin: 0 auto;">
          <div v-for="placement in placements" :key="placement" style="text-align: center;">
            <PPopover
              :pPlacement="placement"
              pTrigger="hover"
              pTitle="Placement Demo"
              :pShowArrow="true"
            >
              <template #content>
                Popover positioned at {{ placement }}
              </template>
              <PButton size="small">{{ placement }}</PButton>
            </PPopover>
          </div>
        </div>
      </div>
    `,
  }),
  args: {},
}

export const WithoutArrow: Story = {
  render: (args: PPopoverProps) => ({
    components: { PPopover, PButton },
    setup() {
      return {
        args,
      }
    },
    template: `
      <div style="padding: 40px; text-align: center;">
        <PPopover v-bind="args">
          <template #content>
            This popover doesn't have an arrow pointing to the trigger element.
          </template>
          <PButton pType="success">No Arrow</PButton>
        </PPopover>
      </div>
    `,
  }),
  args: {
    pPlacement: 'top',
    pDisabled: false,
    pShowArrow: false,
    pTrigger: 'hover',
    pTitle: 'No Arrow',
  },
}

export const DisabledPopover: Story = {
  render: (args: PPopoverProps) => ({
    components: { PPopover, PButton },
    setup() {
      return {
        args,
      }
    },
    template: `
      <div style="padding: 40px; text-align: center;">
        <PPopover v-bind="args">
          <template #content>
            This popover is disabled and won't show.
          </template>
          <PButton pType="info">Disabled Popover</PButton>
        </PPopover>
      </div>
    `,
  }),
  args: {
    pPlacement: 'top',
    pDisabled: true,
    pShowArrow: true,
    pTrigger: 'hover',
    pTitle: 'Disabled',
  },
}

export const LongContent: Story = {
  render: (args: PPopoverProps) => ({
    components: { PPopover, PButton },
    setup() {
      return {
        args,
      }
    },
    template: `
      <div style="padding: 40px; text-align: center;">
        <PPopover v-bind="args">
          <template #content>
            <div style="max-width: 300px;">
              <p><strong>Longer Content Example</strong></p>
              <p>This popover contains more detailed information that spans multiple lines. It demonstrates how the popover handles longer content gracefully.</p>
              <ul>
                <li>Feature 1: Responsive design</li>
                <li>Feature 2: Custom styling</li>
                <li>Feature 3: Flexible positioning</li>
              </ul>
            </div>
          </template>
          <PButton pType="warning">Long Content</PButton>
        </PPopover>
      </div>
    `,
  }),
  args: {
    pPlacement: 'bottom',
    pDisabled: false,
    pShowArrow: true,
    pTrigger: 'click',
    pTitle: 'Detailed Information',
  },
}

export const InteractiveDemo: Story = {
  render: (_args: PPopoverProps) => ({
    components: { PPopover, PButton },
    setup() {
      const config = reactive({
        placement: 'top' as PlacementOptions,
        trigger: 'hover' as TriggerOptionsType,
        showArrow: true,
        disabled: false,
        title: 'Interactive Demo',
      })

      const placements: PlacementOptions[] = ['top', 'right', 'bottom', 'left']
      const triggers = ['hover', 'click', 'focus'] as TriggerOptionsType[]

      const cyclePlacement = () => {
        const currentIndex = placements.indexOf(config.placement)
        config.placement = placements[(currentIndex + 1) % placements.length]
      }

      const cycleTrigger = () => {
        const currentIndex = triggers.indexOf(config.trigger)
        config.trigger = triggers[(currentIndex + 1) % triggers.length]
      }

      return {
        config,
        cyclePlacement,
        cycleTrigger,
      }
    },
    template: `
      <div style="padding: 60px; text-align: center;">
        <h3 style="margin-bottom: 20px;">Interactive Popover Demo</h3>
        
        <div style="margin-bottom: 30px;">
          <button @click="cyclePlacement" style="margin: 5px; padding: 8px 16px; border: 1px solid #ddd; border-radius: 4px; background: white; cursor: pointer;">
            Placement: {{ config.placement }}
          </button>
          <button @click="cycleTrigger" style="margin: 5px; padding: 8px 16px; border: 1px solid #ddd; border-radius: 4px; background: white; cursor: pointer;">
            Trigger: {{ config.trigger }}
          </button>
          <button @click="config.showArrow = !config.showArrow" style="margin: 5px; padding: 8px 16px; border: 1px solid #ddd; border-radius: 4px; background: white; cursor: pointer;">
            Arrow: {{ config.showArrow ? 'On' : 'Off' }}
          </button>
          <button @click="config.disabled = !config.disabled" style="margin: 5px; padding: 8px 16px; border: 1px solid #ddd; border-radius: 4px; background: white; cursor: pointer;">
            {{ config.disabled ? 'Enable' : 'Disable' }}
          </button>
        </div>
        
        <PPopover
          :pPlacement="config.placement"
          :pTrigger="config.trigger"
          :pShowArrow="config.showArrow"
          :pDisabled="config.disabled"
          :pTitle="config.title"
        >
          <template #content>
            <div>
              <p><strong>Current Settings:</strong></p>
              <p>Placement: {{ config.placement }}</p>
              <p>Trigger: {{ config.trigger }}</p>
              <p>Show Arrow: {{ config.showArrow }}</p>
              <p>Disabled: {{ config.disabled }}</p>
            </div>
          </template>
          <PButton pType="primary" :pDisabled="config.disabled">
            Interactive Popover
          </PButton>
        </PPopover>
      </div>
    `,
  }),
  args: {},
}
