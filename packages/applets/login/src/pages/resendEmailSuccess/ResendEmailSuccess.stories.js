import ResendEmailSuccessComponent from './ResendEmailSuccess.vue'
import { withLoginLayout } from '~storybook/decorators/with-login-layout.decorator.ts'

const meta = {
  title: 'Applets/Login/ResendEmailSuccess',
  component: ResendEmailSuccessComponent,
  tags: ['!autodocs'],
  decorators: [withLoginLayout()],
}

export default meta

export const ResendEmailSuccess = {
  render: () => ({
    components: { ResendEmailSuccessComponent },
    template: '<ResendEmailSuccessComponent />',
  }),
}
