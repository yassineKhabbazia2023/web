import LoginCollabComponent from './LoginCollab.vue'

const meta = {
  title: 'Applets/Login/LoginCollab',
  component: LoginCollabComponent,
  tags: ['!autodocs'],
  parameters: { loginLayout: 'collab' },
}

export default meta

export const LoginCollab = {
  render: () => ({
    components: { LoginCollabComponent },
    template: '<LoginCollabComponent />',
  }),
}
