import ValidationCGUComponent from './ValidationCGU.vue'

const meta = {
  title: 'Applets/Login/ValidationCGU',
  component: ValidationCGUComponent,
  tags: ['!autodocs'],
  parameters: { loginLayout: true },
}

export default meta

export const ValidationCGU = {
  render: () => ({
    components: { ValidationCGUComponent },
    template: '<ValidationCGUComponent />',
  }),
}
