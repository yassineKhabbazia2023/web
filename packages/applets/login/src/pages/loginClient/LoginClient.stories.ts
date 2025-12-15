import LoginClientComponent from './LoginClient.vue'

const meta = {
  title: 'Applets/Login/LoginClient',
  component: LoginClientComponent,
  tags: ['!autodocs'],
  parameters: { loginLayout: 'client' },
}

export default meta

export const LoginClient = {
  render: () => ({
    components: { LoginClientComponent },
    template: '<LoginClientComponent />',
  }),
}
