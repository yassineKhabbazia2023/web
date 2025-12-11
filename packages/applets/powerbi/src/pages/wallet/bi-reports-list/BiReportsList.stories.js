import BiReportsListPageComponent from './BiReportsList.page.vue'

const meta = {
  title: 'Applets/PowerBI/BiReportsListPage',
  component: BiReportsListPageComponent,
  tags: ['!autodocs'],
}

export default meta

export const Default = {
  render: () => ({
    components: { BiReportsListPageComponent },
    template: '<BiReportsListPageComponent />',
  }),
}
