import ExpireTokenComponent from './ExpireToken.vue'

const meta = {
  title: 'Applets/Login/ExpireToken',
  component: ExpireTokenComponent,
  tags: ['!autodocs'],
  parameters: { loginLayout: true },
}

export default meta

export const ExpireToken = {
  render: () => ({
    components: { ExpireTokenComponent },
    template: '<ExpireTokenComponent />',
  }),
}
