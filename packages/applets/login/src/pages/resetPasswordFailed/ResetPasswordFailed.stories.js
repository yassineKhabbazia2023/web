import ResetPasswordFailedComponent from './ResetPasswordFailed.vue'
import { withLoginLayout } from '~storybook/decorators/with-login-layout.decorator.ts'

const meta = {
  title: 'Applets/Login/ResetPasswordFailed',
  component: ResetPasswordFailedComponent,
  tags: ['!autodocs'],
  decorators: [withLoginLayout()],
}

export default meta

export const ResetPasswordFailed = {
  render: () => ({
    components: { ResetPasswordFailedComponent },
    template: '<ResetPasswordFailedComponent />',
  }),
}
