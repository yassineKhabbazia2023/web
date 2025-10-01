import ResetPasswordSuccessComponent from './ResetPasswordSuccess.vue'
import { withLoginLayout } from '~storybook/decorators/with-login-layout.decorator.ts'

const meta = {
  title: 'Applets/Login/ResetPasswordSuccess',
  component: ResetPasswordSuccessComponent,
  tags: ['!autodocs'],
  decorators: [withLoginLayout()],
}

export default meta

export const ResetPasswordSuccess = {
  render: () => ({
    components: { ResetPasswordSuccessComponent },
    template: '<ResetPasswordSuccessComponent />',
  }),
}
