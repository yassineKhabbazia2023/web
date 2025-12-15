import ResetPasswordFailedComponent from './ResetPasswordFailed.vue'

const meta = {
  title: 'Applets/Login/ResetPasswordFailed',
  component: ResetPasswordFailedComponent,
  tags: ['!autodocs'],
  parameters: { loginLayout: true },
}

export default meta

export const ResetPasswordFailed = {
  render: () => ({
    components: { ResetPasswordFailedComponent },
    template: '<ResetPasswordFailedComponent />',
  }),
}
