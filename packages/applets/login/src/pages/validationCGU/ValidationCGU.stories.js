import ValidationCGUComponent from './ValidationCGU.vue'
import { withLoginLayout } from '~storybook/decorators/with-login-layout.decorator.ts'

const meta = {
  title: 'Applets/Login/ValidationCGU',
  component: ValidationCGUComponent,
  tags: ['!autodocs'],
  decorators: [withLoginLayout()],
}

export default meta

export const ValidationCGU = {
  render: () => ({
    components: { ValidationCGUComponent },
    template: '<ValidationCGUComponent />',
  }),
}
