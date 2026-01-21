import Error403Page from './error-403.page.vue'

const meta = {
  title: 'Libraries/Shared/Pages/Error/403',
  component: Error403Page,
  tags: ['!autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

export const Default = {
  render: () => ({
    components: { Error403Page },
    template: '<Error403Page />',
  }),
}
