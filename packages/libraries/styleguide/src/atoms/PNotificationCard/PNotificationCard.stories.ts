import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PNotificationCard from './PNotificationCard.vue'
import PButton from '../PButton/PButton.vue'
import PIcon from '../PIcon/PIcon.vue'
import PAvatar from '../PAvatar/PAvatar.vue'
import PToolbox from '../../molecules/PToolbox/PToolbox.vue'
import type { PToolboxItemProps } from '../PToolboxItem/PToolboxItemTypes'
import { AppColors } from '../../utils/AppColorsEnum'

const toolboxBasicData: PToolboxItemProps[] = [
  {
    pIconName: 'check',
    pValue: 'Mark all read',
    pActionName: 'readall',
    pState: 'default',
  },
  {
    pIconName: 'trash',
    pValue: 'Delete notification',
    pActionName: 'delete',
    pState: 'default',
  },
  {
    pIconName: 'gear',
    pValue: "Access to the notification's parameters",
    pActionName: 'parameters',
    pState: 'default',
  },
  {
    pIconName: 'bellSlash',
    pValue: 'Disable this type of notifications',
    pActionName: 'disable',
    pState: 'default',
  },
]

const meta: Meta<typeof PNotificationCard> = {
  title: 'Atoms/PNotificationCard',
  component: PNotificationCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A notification card component for displaying notification messages.',
      },
    },
  },
  argTypes: {
    pIsNew: {
      control: 'boolean',
      description: 'Whether the notification is new/unread',
    },
    pTime: {
      control: 'text',
      description: 'Time indication for the notification',
    },
  },
  args: {
    pIsNew: false,
    pTime: '1sem',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PNotificationCard, PButton, PIcon, PAvatar, PToolbox },
    setup: () => ({ args, toolboxBasicData, AppColors }),
    template: `
      <div style="width: 400px;">
        <PNotificationCard v-bind="args">
          <template #avatar>
            <PAvatar
              pShape="circle"
              pType="default"
              pColor="persian-gradient"
            >
              AB
            </PAvatar>
          </template>
          <template #text>
            <span class="font-bold">Alexandre De Lavandia</span> filed you a document <span class="font-bold">liasse-fiscale.pdf</span> inside the folder Publications.
          </template>
          <template #actions>
            <PToolbox :pElements="toolboxBasicData">
              <PButton
                class="el-button--icon"
                pSize="small"
              >
                <PIcon pName="threeDots" :pColor="AppColors.GRAY_400" />
              </PButton>
            </PToolbox>
          </template>
        </PNotificationCard>
      </div>
    `,
  }),
}

export const NewNotification: Story = {
  args: {
    pIsNew: true,
    pTime: '1 min',
  },
  render: (args) => ({
    components: { PNotificationCard, PButton, PIcon, PAvatar, PToolbox },
    setup() {
      return { args, toolboxBasicData, AppColors }
    },
    template: `
      <div style="width: 400px;">
        <PNotificationCard v-bind="args">
          <template #avatar>
            <PAvatar
              pShape="circle"
              pType="default"
              pColor="persian-gradient"
            >
              AB
            </PAvatar>
          </template>
          <template #text>
            <span class="font-bold">Alexandre De Lavandia</span> filed you a document <span class="font-bold">liasse-fiscale.pdf</span> inside the folder Publications.
          </template>
          <template #actions>
            <PToolbox :pElements="toolboxBasicData">
              <PButton
                class="el-button--icon"
                pSize="small"
              >
                <PIcon pName="threeDots" :pColor="AppColors.GRAY_400" />
              </PButton>
            </PToolbox>
          </template>
        </PNotificationCard>
      </div>
    `,
  }),
}

export const SimpleNotification: Story = {
  args: {
    pTime: '5 min',
  },
  render: (args) => ({
    components: { PNotificationCard },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 400px;">
        <PNotificationCard v-bind="args">
          <template #text>
            You have a new message
          </template>
        </PNotificationCard>
      </div>
    `,
  }),
}

export const LongTextNotification: Story = {
  args: {
    pIsNew: true,
    pTime: '30 min',
  },
  render: (args) => ({
    components: { PNotificationCard, PAvatar },
    setup: () => ({ args }),
    template: `
      <div style="width: 400px;">
        <PNotificationCard v-bind="args">
          <template #avatar>
            <PAvatar
              pShape="circle"
              pType="default"
              pColor="persian-gradient"
            >
              AB
            </PAvatar>
          </template>
          <template #text>
            <span class="font-bold">John Doe</span> has shared multiple documents with you including quarterly reports, budget analysis, and strategic planning documents for the upcoming fiscal year.
          </template>
        </PNotificationCard>
      </div>
    `,
  }),
}
