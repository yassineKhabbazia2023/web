import ResetPasswordComponent from './ResetPassword.vue'

const meta = {
  title: 'Applets/Login/ResetPassword',
  component: ResetPasswordComponent,
  tags: ['!autodocs'],
  parameters: { loginLayout: true },
}

export default meta

export const ResetPassword = {
  render: () => ({
    components: { ResetPasswordComponent },
    template: '<ResetPasswordComponent />',
  }),
}
