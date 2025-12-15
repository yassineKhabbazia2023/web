import ResendEmailSuccessComponent from './ResendEmailSuccess.vue'

const meta = {
  title: 'Applets/Login/ResendEmailSuccess',
  component: ResendEmailSuccessComponent,
  tags: ['!autodocs'],
  parameters: { loginLayout: true },
}

export default meta

export const ResendEmailSuccess = {
  render: () => ({
    components: { ResendEmailSuccessComponent },
    template: '<ResendEmailSuccessComponent />',
  }),
}
