import ResetPasswordComponent from './ResetPassword.vue'
import { withLoginLayout } from '~storybook/decorators/with-login-layout.decorator.ts'

const meta = {
  title: 'Applets/Login/ResetPassword',
  component: ResetPasswordComponent,
  tags: ['!autodocs'],
  decorators: [withLoginLayout()],
}

export default meta

export const ResetPassword = {
  render: () => ({
    components: { ResetPasswordComponent },
    template: '<ResetPasswordComponent />',
  }),
}
