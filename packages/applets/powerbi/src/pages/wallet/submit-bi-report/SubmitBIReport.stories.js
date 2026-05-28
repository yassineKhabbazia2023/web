import SubmitBIReportPageComponent from './SubmitBIReport.page.vue'

const meta = {
  title: 'Applets/PowerBI/SubmitBIReportPage',
  component: SubmitBIReportPageComponent,
  tags: ['!autodocs'],
}

export default meta

export const Default = {
  render: () => ({
    components: { SubmitBIReportPageComponent },
    template: '<SubmitBIReportPageComponent />',
  }),
}
