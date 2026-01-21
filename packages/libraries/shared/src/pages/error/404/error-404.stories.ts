import Error404Page from './error-404.page.vue'

const meta = {
  title: 'Libraries/Shared/Pages/Error/404',
  component: Error404Page,
  tags: ['!autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

export const Default = {
  render: () => ({
    components: { Error404Page },
    template: '<Error404Page />',
  }),
}
