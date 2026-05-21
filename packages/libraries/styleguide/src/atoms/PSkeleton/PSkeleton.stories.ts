import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import PButton from '../PButton/PButton.vue'
import PSkeleton from './PSkeleton.vue'
import PSkeletonItem from './PSkeletonItem.vue'

const meta: Meta<typeof PSkeleton> = {
  title: 'Atoms/PSkeleton',
  component: PSkeleton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Skeleton loading placeholder based on Element Plus.',
      },
    },
  },
  argTypes: {
    pAnimated: {
      control: 'boolean',
      description: 'Enable skeleton animation',
    },
    pCount: {
      control: 'number',
      description: 'Number of skeleton repetitions',
    },
    pRows: {
      control: 'number',
      description: 'Number of rows per skeleton',
    },
    pLoading: {
      control: 'boolean',
      description: 'Show skeleton when true, show default slot content when false',
    },
    pThrottle: {
      control: 'number',
      description: 'Throttle delay in ms before showing the skeleton',
    },
  },
  args: {
    pAnimated: true,
    pCount: 1,
    pRows: 3,
    pLoading: true,
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PSkeleton },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 400px;">
        <PSkeleton v-bind="args" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Default animated skeleton with 3 rows.',
      },
    },
  },
}

export const WithContent: Story = {
  render: () => ({
    components: { PSkeleton, PButton },
    setup() {
      const loading = ref(false)
      const reload = () => {
        loading.value = true
        setTimeout(() => {
          loading.value = false
        }, 2000)
      }
      return { loading, reload }
    },
    template: `
      <div style="width: 400px; display: flex; flex-direction: column; gap: 16px;">
        <PSkeleton pAnimated :pLoading="loading">
          <p>Content loaded successfully.</p>
        </PSkeleton>
        <PButton pType="primary" @click="reload">Reload</PButton>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'When pLoading is false, the default slot content is displayed. Click the button to simulate a reload.',
      },
    },
  },
}

export const CustomTemplate: Story = {
  render: () => ({
    components: { PSkeleton, PSkeletonItem },
    template: `
      <div style="width: 400px;">
        <PSkeleton pAnimated :pLoading="true">
          <template #template>
            <div style="display: flex; align-items: center; gap: 16px;">
              <PSkeletonItem
                pVariant="circle"
                :pWidth="48"
                :pHeight="48"
              />
              <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                <PSkeletonItem
                  pVariant="h3"
                  pWidth="50%"
                />
                <PSkeletonItem pVariant="text" />
                <PSkeletonItem
                  pVariant="text"
                  pWidth="75%"
                />
              </div>
            </div>
          </template>
        </PSkeleton>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Custom skeleton layout using the template slot with PSkeletonItem variants. Sizes are controlled via the `pWidth` / `pHeight` props (strings like `"50%"` or numbers interpreted as px).',
      },
    },
  },
}

export const CustomSize: Story = {
  render: () => ({
    components: { PSkeleton, PSkeletonItem },
    template: `
      <div style="width: 400px; display: flex; flex-direction: column; gap: 16px;">
        <PSkeleton pAnimated :pLoading="true">
          <template #template>
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div>
                <p style="margin-bottom: 4px; font-size: 12px; color: #6c757d;">pWidth="50%"</p>
                <PSkeletonItem
                  pVariant="text"
                  pWidth="50%"
                />
              </div>
              <div>
                <p style="margin-bottom: 4px; font-size: 12px; color: #6c757d;">pWidth=120 pHeight=32 (px numbers)</p>
                <PSkeletonItem
                  pVariant="button"
                  :pWidth="120"
                  :pHeight="32"
                />
              </div>
              <div>
                <p style="margin-bottom: 4px; font-size: 12px; color: #6c757d;">pWidth=48 pHeight=48 (circle)</p>
                <PSkeletonItem
                  pVariant="circle"
                  :pWidth="48"
                  :pHeight="48"
                />
              </div>
            </div>
          </template>
        </PSkeleton>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'PSkeletonItem accepts `pWidth` and `pHeight` props (string like `"50%"` or number in px) to size items inline without writing CSS.',
      },
    },
  },
}

export const Variants: Story = {
  render: () => ({
    components: { PSkeleton, PSkeletonItem },
    template: `
      <div style="width: 400px; display: flex; flex-direction: column; gap: 16px;">
        <PSkeleton pAnimated :pLoading="true">
          <template #template>
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div>
                <p style="margin-bottom: 4px; font-size: 12px; color: #6c757d;">text</p>
                <PSkeletonItem pVariant="text" />
              </div>
              <div>
                <p style="margin-bottom: 4px; font-size: 12px; color: #6c757d;">h1</p>
                <PSkeletonItem pVariant="h1" />
              </div>
              <div>
                <p style="margin-bottom: 4px; font-size: 12px; color: #6c757d;">h3</p>
                <PSkeletonItem pVariant="h3" />
              </div>
              <div>
                <p style="margin-bottom: 4px; font-size: 12px; color: #6c757d;">p</p>
                <PSkeletonItem pVariant="p" />
              </div>
              <div>
                <p style="margin-bottom: 4px; font-size: 12px; color: #6c757d;">caption</p>
                <PSkeletonItem pVariant="caption" />
              </div>
              <div>
                <p style="margin-bottom: 4px; font-size: 12px; color: #6c757d;">button</p>
                <PSkeletonItem pVariant="button" />
              </div>
              <div>
                <p style="margin-bottom: 4px; font-size: 12px; color: #6c757d;">circle</p>
                <PSkeletonItem pVariant="circle" />
              </div>
              <div>
                <p style="margin-bottom: 4px; font-size: 12px; color: #6c757d;">rect</p>
                <PSkeletonItem pVariant="rect" />
              </div>
              <div>
                <p style="margin-bottom: 4px; font-size: 12px; color: #6c757d;">image</p>
                <PSkeletonItem pVariant="image" />
              </div>
            </div>
          </template>
        </PSkeleton>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'All available PSkeletonItem variants.',
      },
    },
  },
}
