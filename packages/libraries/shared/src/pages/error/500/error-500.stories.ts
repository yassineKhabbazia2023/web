import Error500Page from './error-500.page.vue'

const meta = {
  title: 'Libraries/Shared/Pages/Error/500',
  component: Error500Page,
  tags: ['!autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

export const Default = {
  render: () => ({
    components: { Error500Page },
    template: '<div style="height: 100vh"><Error500Page /></div>',
  }),
}
