import ResetPasswordFormComponent from './ResetPasswordForm.vue'
import { withLoginLayout } from '~storybook/decorators/with-login-layout.decorator.ts'

const meta = {
  title: 'Applets/Login/ResetPasswordForm',
  component: ResetPasswordFormComponent,
  tags: ['!autodocs'],
  decorators: [withLoginLayout()],
}

export default meta

export const ResetPasswordForm = {
  render: () => ({
    components: { ResetPasswordFormComponent },
    template: '<ResetPasswordFormComponent />',
  }),
}
