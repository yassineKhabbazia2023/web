import ExpireTokenComponent from './ExpireToken.vue'
import { withLoginLayout } from '~storybook/decorators/with-login-layout.decorator.ts'

const meta = {
  title: 'Applets/Login/ExpireToken',
  component: ExpireTokenComponent,
  tags: ['!autodocs'],
  decorators: [withLoginLayout()],
}

export default meta

export const ExpireToken = {
  render: () => ({
    components: { ExpireTokenComponent },
    template: '<ExpireTokenComponent />',
  }),
}
