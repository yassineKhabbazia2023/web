import ResetPasswordSuccessComponent from './ResetPasswordSuccess.vue'

const meta = {
  title: 'Applets/Login/ResetPasswordSuccess',
  component: ResetPasswordSuccessComponent,
  tags: ['!autodocs'],
  parameters: { loginLayout: true },
}

export default meta

export const ResetPasswordSuccess = {
  render: () => ({
    components: { ResetPasswordSuccessComponent },
    template: '<ResetPasswordSuccessComponent />',
  }),
}
