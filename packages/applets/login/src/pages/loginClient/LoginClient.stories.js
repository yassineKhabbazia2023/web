import LoginClientComponent from './LoginClient.vue'
import { withLoginLayoutClient } from '~storybook/decorators/with-login-layout.decorator.ts'

const meta = {
  title: 'Applets/Login/LoginClient',
  component: LoginClientComponent,
  tags: ['!autodocs'],
  decorators: [withLoginLayoutClient],
}

export default meta

export const LoginClient = {
  render: () => ({
    components: { LoginClientComponent },
    template: '<LoginClientComponent />',
  }),
}
