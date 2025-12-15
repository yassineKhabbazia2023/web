import CreatePasswordComponent from './CreatePassword.vue'

const meta = {
  title: 'Applets/Login/CreatePassword',
  component: CreatePasswordComponent,
  tags: ['!autodocs'],
  parameters: { loginLayout: true },
}

export default meta

export const CreatePassword = {
  render: () => ({
    components: { CreatePasswordComponent },
    template: '<CreatePasswordComponent />',
  }),
}
