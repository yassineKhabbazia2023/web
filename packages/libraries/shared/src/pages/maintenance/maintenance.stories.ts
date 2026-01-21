import MaintenancePage from './maintenance.page.vue'

const meta = {
  title: 'Libraries/Shared/Pages/Maintenance',
  component: MaintenancePage,
  tags: ['!autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

export const Default = {
  render: () => ({
    components: { MaintenancePage },
    template: '<div style="height: 100vh"><MaintenancePage /></div>',
  }),
}
