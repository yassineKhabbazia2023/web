import CreatePasswordComponent from './CreatePassword.vue'
import { withLoginLayout } from '~storybook/decorators/with-login-layout.decorator.ts'

const meta = {
  title: 'Applets/Login/CreatePassword',
  component: CreatePasswordComponent,
  tags: ['!autodocs'],
  decorators: [withLoginLayout()],
}

export default meta

export const CreatePassword = {
  render: () => ({
    components: { CreatePasswordComponent },
    template: '<CreatePasswordComponent />',
  }),
}
