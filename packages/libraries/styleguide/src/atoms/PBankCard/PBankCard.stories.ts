import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PBankCard from './PBankCard.vue'

const meta: Meta<typeof PBankCard> = {
  title: 'Atoms/PBankCard',
  component: PBankCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Composant de carte bancaire affichant les informations d\'un compte avec montant.',
      },
    },
  },
  argTypes: {
    pStartTitle: {
      control: 'text',
      description: 'Préfixe du titre pour l\'accessibilité',
    },
    pTitle: {
      control: 'text',
      description: 'Nom de la banque ou titre principal',
    },
    pAccountNumber: {
      control: 'text',
      description: 'Numéro de compte',
    },
    pAccountText: {
      control: 'text',
      description: 'Texte descriptif du compte',
    },
    pAmount: {
      control: 'text',
      description: 'Montant affiché',
    },
  },
  args: {
    pStartTitle: 'Compte',
    pTitle: 'Crédit Agricole',
    pAccountNumber: '•••• 1234',
    pAccountText: 'Compte courant',
    pAmount: '2 847,50 €',
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  render: (args) => ({
    components: { PBankCard },
    setup() {
      return { args }
    },
    template: '<PBankCard v-bind="args" />',
  }),
  parameters: {
    docs: {
      description: {
        story: 'Carte bancaire par défaut avec les informations de compte.',
      },
    },
  },
}

// Different banks
export const DifferentBanks: Story = {
  render: () => ({
    components: { PBankCard },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 16px;">
        <PBankCard
          pStartTitle="Compte"
          pTitle="Crédit Agricole"
          pAccountNumber="•••• 1234"
          pAccountText="Compte courant"
          pAmount="2 847,50 €"
        />
        <PBankCard
          pStartTitle="Livret"
          pTitle="BNP Paribas"
          pAccountNumber="•••• 5678"
          pAccountText="Livret A"
          pAmount="15 624,30 €"
        />
        <PBankCard
          pStartTitle="Compte"
          pTitle="Société Générale"
          pAccountNumber="•••• 9012"
          pAccountText="Compte épargne"
          pAmount="8 156,75 €"
        />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Exemples de cartes bancaires avec différentes banques et types de comptes.',
      },
    },
  },
}

// Different amounts
export const DifferentAmounts: Story = {
  render: () => ({
    components: { PBankCard },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 16px;">
        <PBankCard
          pStartTitle="Compte"
          pTitle="Banque Populaire"
          pAccountNumber="•••• 3456"
          pAccountText="Compte courant"
          pAmount="123,45 €"
        />
        <PBankCard
          pStartTitle="Compte"
          pTitle="LCL"
          pAccountNumber="•••• 7890"
          pAccountText="Compte joint"
          pAmount="25 847,90 €"
        />
        <PBankCard
          pStartTitle="Compte"
          pTitle="Caisse d'Épargne"
          pAccountNumber="•••• 2468"
          pAccountText="Compte professionnel"
          pAmount="156 234,00 €"
        />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Cartes bancaires avec différents montants pour tester l\'affichage.',
      },
    },
  },
}

// Different account types
export const AccountTypes: Story = {
  render: () => ({
    components: { PBankCard },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 16px;">
        <PBankCard
          pStartTitle="Compte"
          pTitle="HSBC"
          pAccountNumber="FR76 1234"
          pAccountText="Compte courant"
          pAmount="3 542,18 €"
        />
        <PBankCard
          pStartTitle="Livret"
          pTitle="La Banque Postale"
          pAccountNumber="FR76 5678"
          pAccountText="Livret de développement durable"
          pAmount="12 000,00 €"
        />
        <PBankCard
          pStartTitle="PEL"
          pTitle="Crédit Mutuel"
          pAccountNumber="FR76 9012"
          pAccountText="Plan épargne logement"
          pAmount="45 678,90 €"
        />
        <PBankCard
          pStartTitle="Assurance vie"
          pTitle="AXA Banque"
          pAccountNumber="FR76 3456"
          pAccountText="Contrat Multisupport"
          pAmount="89 542,33 €"
        />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Différents types de comptes et produits bancaires.',
      },
    },
  },
}
