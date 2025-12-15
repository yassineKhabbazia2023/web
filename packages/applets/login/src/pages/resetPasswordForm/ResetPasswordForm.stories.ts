import ResetPasswordFormComponent from './ResetPasswordForm.vue'

const meta = {
  title: 'Applets/Login/ResetPasswordForm',
  component: ResetPasswordFormComponent,
  tags: ['!autodocs'],
  parameters: { loginLayout: true },
}

export default meta

export const ResetPasswordForm = {
  render: () => ({
    components: { ResetPasswordFormComponent },
    template: '<ResetPasswordFormComponent />',
  }),
}
