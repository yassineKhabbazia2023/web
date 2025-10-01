import LoginCollabComponent from './LoginCollab.vue'
import { withLoginLayoutCollab } from '~storybook/decorators/with-login-layout.decorator.ts'

const meta = {
  title: 'Applets/Login/LoginCollab',
  component: LoginCollabComponent,
  tags: ['!autodocs'],
  decorators: [withLoginLayoutCollab],
}

export default meta

export const LoginCollab = {
  render: () => ({
    components: { LoginCollabComponent },
    template: '<LoginCollabComponent />',
  }),
}
