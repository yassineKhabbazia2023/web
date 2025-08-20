import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, reactive } from 'vue'
import PCollapse from './PCollapse.vue'
import PCollapseItem from '../../atoms/PCollapseItem'
import type { PCollapseProps } from './PCollapseTypes'
import type { IconName } from '../../types/IconName.types'

interface CollapseItemState {
  pTitleCollapseItem: string
  pIconName: IconName
  disabled: boolean
  pFullBody: boolean
}

const meta: Meta<typeof PCollapse> = {
  title: 'Molecules/PCollapse',
  component: PCollapse,
  parameters: {
    docs: {
      description: {
        component: 'A collapsible content container component supporting multiple display types and accordion behavior.',
      },
    },
  },
  argTypes: {
    pAccordion: {
      control: 'boolean',
      description: 'Enable accordion mode (only one panel can be open at a time)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PCollapse>

const Template = (args: PCollapseProps & { modelValue?: string[] }) => ({
  components: { PCollapse, PCollapseItem },
  setup() {
    const activeNames = ref(args.modelValue || ['1'])
    const firstCollapseItem = reactive<CollapseItemState>({
      pTitleCollapseItem: 'Consistency',
      pIconName: 'archive',
      disabled: false,
      pFullBody: false,
    })
    const secondCollapseItem = reactive<CollapseItemState>({
      pTitleCollapseItem: 'Feedback',
      pIconName: 'archive',
      disabled: false,
      pFullBody: false,
    })

    return {
      args,
      activeNames,
      firstCollapseItem,
      secondCollapseItem,
    }
  },
  template: `
    <div style="height: 300px; padding: 24px;">
      <PCollapse
        v-model="activeNames"
        :pAccordion="args.pAccordion"
      >
        <PCollapseItem
          pType="default"
          :pTitleCollapseItem="firstCollapseItem.pTitleCollapseItem"
          :pIconName="firstCollapseItem.pIconName"
          :disabled="firstCollapseItem.disabled"
          :pFullBody="firstCollapseItem.pFullBody"
          name="1"
        >
          <div>Content for first collapse item</div>
        </PCollapseItem>
        <PCollapseItem
          pType="default"
          :pTitleCollapseItem="secondCollapseItem.pTitleCollapseItem"
          :pIconName="secondCollapseItem.pIconName"
          :disabled="secondCollapseItem.disabled"
          :pFullBody="secondCollapseItem.pFullBody"
          name="2"
        >
          <div>Content for second collapse item</div>
        </PCollapseItem>
      </PCollapse>
    </div>
  `,
})

export const Default: Story = {
  render: Template,
  args: {
    pAccordion: false,
  },
}

export const Accordion: Story = {
  render: Template,
  args: {
    pAccordion: true,
  },
}

export const ShadowVariant: Story = {
  render: (args: PCollapseProps & { modelValue?: string[] }) => ({
    components: { PCollapse, PCollapseItem },
    setup() {
      const activeNames = ref(args.modelValue || ['1'])
      const firstCollapseItem = reactive<CollapseItemState>({
        pTitleCollapseItem: 'Consistency',
        pIconName: 'archive',
        disabled: false,
        pFullBody: false,
      })
      const secondCollapseItem = reactive<CollapseItemState>({
        pTitleCollapseItem: 'Feedback',
        pIconName: 'archive',
        disabled: false,
        pFullBody: false,
      })

      return {
        args,
        activeNames,
        firstCollapseItem,
        secondCollapseItem,
      }
    },
    template: `
      <div style="height: 300px; padding: 24px;">
        <PCollapse
          v-model="activeNames"
          :pAccordion="args.pAccordion"
        >
          <PCollapseItem
            pType="shadow"
            :pTitleCollapseItem="firstCollapseItem.pTitleCollapseItem"
            :pIconName="firstCollapseItem.pIconName"
            :disabled="firstCollapseItem.disabled"
            :pFullBody="firstCollapseItem.pFullBody"
            name="1"
          >
            <div>Content for first shadow collapse item</div>
          </PCollapseItem>
          <PCollapseItem
            pType="shadow"
            :pTitleCollapseItem="secondCollapseItem.pTitleCollapseItem"
            :pIconName="secondCollapseItem.pIconName"
            :disabled="secondCollapseItem.disabled"
            :pFullBody="secondCollapseItem.pFullBody"
            name="2"
          >
            <div>Content for second shadow collapse item</div>
          </PCollapseItem>
        </PCollapse>
      </div>
    `,
  }),
  args: {
    pAccordion: false,
  },
}

export const AlertVariant: Story = {
  render: (args: PCollapseProps & { modelValue?: string[] }) => ({
    components: { PCollapse, PCollapseItem },
    setup() {
      const activeNames = ref(args.modelValue || ['1'])
      const firstCollapseItem = reactive<CollapseItemState>({
        pTitleCollapseItem: 'Consistency',
        pIconName: 'archive',
        disabled: false,
        pFullBody: false,
      })
      const secondCollapseItem = reactive<CollapseItemState>({
        pTitleCollapseItem: 'Feedback',
        pIconName: 'archive',
        disabled: false,
        pFullBody: false,
      })

      return {
        args,
        activeNames,
        firstCollapseItem,
        secondCollapseItem,
      }
    },
    template: `
      <div style="height: 300px; padding: 24px;">
        <PCollapse
          v-model="activeNames"
          :pAccordion="args.pAccordion"
        >
          <PCollapseItem
            pType="alert"
            :pTitleCollapseItem="firstCollapseItem.pTitleCollapseItem"
            :pIconName="firstCollapseItem.pIconName"
            :disabled="firstCollapseItem.disabled"
            :pFullBody="firstCollapseItem.pFullBody"
            name="1"
          >
            <div>Content for first alert collapse item</div>
          </PCollapseItem>
          <PCollapseItem
            pType="alert"
            :pTitleCollapseItem="secondCollapseItem.pTitleCollapseItem"
            :pIconName="secondCollapseItem.pIconName"
            :disabled="secondCollapseItem.disabled"
            :pFullBody="secondCollapseItem.pFullBody"
            name="2"
          >
            <div>Content for second alert collapse item</div>
          </PCollapseItem>
        </PCollapse>
      </div>
    `,
  }),
  args: {
    pAccordion: false,
  },
}

export const GrayVariant: Story = {
  render: (args: PCollapseProps & { modelValue?: string[] }) => ({
    components: { PCollapse, PCollapseItem },
    setup() {
      const activeNames = ref(args.modelValue || ['1'])
      const firstCollapseItem = reactive<CollapseItemState>({
        pTitleCollapseItem: 'Consistency',
        pIconName: 'archive',
        disabled: false,
        pFullBody: false,
      })
      const secondCollapseItem = reactive<CollapseItemState>({
        pTitleCollapseItem: 'Feedback',
        pIconName: 'archive',
        disabled: false,
        pFullBody: false,
      })

      return {
        args,
        activeNames,
        firstCollapseItem,
        secondCollapseItem,
      }
    },
    template: `
      <div style="height: 300px; padding: 24px;">
        <PCollapse
          v-model="activeNames"
          :pAccordion="args.pAccordion"
        >
          <PCollapseItem
            pType="gray"
            :pTitleCollapseItem="firstCollapseItem.pTitleCollapseItem"
            :pIconName="firstCollapseItem.pIconName"
            :disabled="firstCollapseItem.disabled"
            :pFullBody="firstCollapseItem.pFullBody"
            name="1"
          >
            <div>Content for first gray collapse item</div>
          </PCollapseItem>
          <PCollapseItem
            pType="gray"
            :pTitleCollapseItem="secondCollapseItem.pTitleCollapseItem"
            :pIconName="secondCollapseItem.pIconName"
            :disabled="secondCollapseItem.disabled"
            :pFullBody="secondCollapseItem.pFullBody"
            name="2"
          >
            <div>Content for second gray collapse item</div>
          </PCollapseItem>
        </PCollapse>
      </div>
    `,
  }),
  args: {
    pAccordion: false,
  },
}

export const DisabledItems: Story = {
  render: (args: PCollapseProps & { modelValue?: string[] }) => ({
    components: { PCollapse, PCollapseItem },
    setup() {
      const activeNames = ref(args.modelValue || ['1'])
      const firstCollapseItem = reactive<CollapseItemState>({
        pTitleCollapseItem: 'Active Item',
        pIconName: 'archive',
        disabled: false,
        pFullBody: false,
      })
      const secondCollapseItem = reactive<CollapseItemState>({
        pTitleCollapseItem: 'Disabled Item',
        pIconName: 'archive',
        disabled: true,
        pFullBody: false,
      })

      return {
        args,
        activeNames,
        firstCollapseItem,
        secondCollapseItem,
      }
    },
    template: `
      <div style="height: 300px; padding: 24px;">
        <PCollapse
          v-model="activeNames"
          :pAccordion="args.pAccordion"
        >
          <PCollapseItem
            pType="default"
            :pTitleCollapseItem="firstCollapseItem.pTitleCollapseItem"
            :pIconName="firstCollapseItem.pIconName"
            :disabled="firstCollapseItem.disabled"
            :pFullBody="firstCollapseItem.pFullBody"
            name="1"
          >
            <div>This item is active and can be toggled</div>
          </PCollapseItem>
          <PCollapseItem
            pType="default"
            :pTitleCollapseItem="secondCollapseItem.pTitleCollapseItem"
            :pIconName="secondCollapseItem.pIconName"
            :disabled="secondCollapseItem.disabled"
            :pFullBody="secondCollapseItem.pFullBody"
            name="2"
          >
            <div>This item is disabled and cannot be toggled</div>
          </PCollapseItem>
        </PCollapse>
      </div>
    `,
  }),
  args: {
    pAccordion: false,
  },
}

export const FullBodyMode: Story = {
  render: (args: PCollapseProps & { modelValue?: string[] }) => ({
    components: { PCollapse, PCollapseItem },
    setup() {
      const activeNames = ref(args.modelValue || ['1'])
      const firstCollapseItem = reactive<CollapseItemState>({
        pTitleCollapseItem: 'Full Body Item',
        pIconName: 'archive',
        disabled: false,
        pFullBody: true,
      })
      const secondCollapseItem = reactive<CollapseItemState>({
        pTitleCollapseItem: 'Normal Item',
        pIconName: 'archive',
        disabled: false,
        pFullBody: false,
      })

      return {
        args,
        activeNames,
        firstCollapseItem,
        secondCollapseItem,
      }
    },
    template: `
      <div style="height: 300px; padding: 24px;">
        <PCollapse
          v-model="activeNames"
          :pAccordion="args.pAccordion"
        >
          <PCollapseItem
            pType="default"
            :pTitleCollapseItem="firstCollapseItem.pTitleCollapseItem"
            :pIconName="firstCollapseItem.pIconName"
            :disabled="firstCollapseItem.disabled"
            :pFullBody="firstCollapseItem.pFullBody"
            name="1"
          >
            <div>This item uses full body mode</div>
          </PCollapseItem>
          <PCollapseItem
            pType="default"
            :pTitleCollapseItem="secondCollapseItem.pTitleCollapseItem"
            :pIconName="secondCollapseItem.pIconName"
            :disabled="secondCollapseItem.disabled"
            :pFullBody="secondCollapseItem.pFullBody"
            name="2"
          >
            <div>This item uses normal mode</div>
          </PCollapseItem>
        </PCollapse>
      </div>
    `,
  }),
  args: {
    pAccordion: false,
  },
}
