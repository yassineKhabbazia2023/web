import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PMaintenance from './PMaintenance.vue'
import { PMaintenanceProps } from './PMaintenance.types'

const meta: Meta<typeof PMaintenance> = {
  title: 'Organisms/PMaintenance',
  component: PMaintenance,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A maintenance page component that displays a maintenance message with illustration and customizable content slots.',
      },
    },
  },
  argTypes: {
    pIllustrationName: {
      control: 'select',
      options: ['error-page-1', 'error-page-2', 'error-page-3'],
      description: 'Name of the illustration to display',
      table: {
        type: { summary: 'ImageName' },
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<PMaintenanceProps>

export const Default: Story = {
  render: (args) => ({
    components: { PMaintenance },
    setup() {
      return {
        args,
      }
    },
    template: `
      <PMaintenance v-bind="args">
        <template #title>
          <span>
            La plateforme est en
          </span>
          <span class="text-color--secondary-amethyste">maintenance</span>
        </template>

        <template #subtitle>
          La plateforme est actuellement en maintenance.
          Nous faisons le nécessaire pour rétablir l'accès dans les plus brefs délais.
          Merci de votre patience.
        </template>

        <template #footer>
          <ul class="list-style-none">
            <li>Mentions légales</li>
            <li>Politique de confidentialité</li>
            <li>Contact Support : 09 73 73 3000</li>
            <li>© 2026 RYDGE Conseil</li>
          </ul>
        </template>
      </PMaintenance>
    `,
  }),
  args: {
    pIllustrationName: 'error-page-1',
  },
}

export const ScheduledMaintenance: Story = {
  render: (args) => ({
    components: { PMaintenance },
    setup() {
      return {
        args,
      }
    },
    template: `
      <PMaintenance v-bind="args">
        <template #title>
          <span>
            Maintenance programmée en
          </span>
          <span class="text-color--secondary-amethyste">cours</span>
        </template>

        <template #subtitle>
          <div>
            <p>Nous effectuons actuellement une maintenance programmée pour améliorer nos services.</p>
            <p><strong>Durée estimée :</strong> 2 heures</p>
            <p><strong>Fin prévue :</strong> ${new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleString()}</p>
          </div>
        </template>

        <template #footer>
          <ul class="list-style-none" style="text-align: center;">
            <li>Suivez-nous sur les réseaux sociaux pour les mises à jour</li>
            <li>📧 notifications@example.com</li>
            <li>📞 Urgences uniquement : +33 1 23 45 67 89</li>
            <li style="margin-top: 20px;">© 2024 Your Company Name</li>
          </ul>
        </template>
      </PMaintenance>
    `,
  }),
  args: {
    pIllustrationName: 'error-page-2',
  },
}

export const SystemUpgrade: Story = {
  render: (args) => ({
    components: { PMaintenance },
    setup() {
      return {
        args,
      }
    },
    template: `
      <PMaintenance v-bind="args">
        <template #title>
          <span>
            Mise à jour du
          </span>
          <span class="text-color--secondary-amethyste">système</span>
        </template>

        <template #subtitle>
          <div style="text-align: center;">
            <p>Nous procédons actuellement à une importante mise à jour de notre système.</p>
            <p>Cette mise à jour apportera de nouvelles fonctionnalités et améliorations.</p>
            <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 8px; display: inline-block;">
              <h4 style="margin: 0 0 10px 0;">Nouvelles fonctionnalités à venir :</h4>
              <ul style="text-align: left; margin: 0;">
                <li>Interface utilisateur améliorée</li>
                <li>Performances optimisées</li>
                <li>Nouvelles options de personnalisation</li>
                <li>Sécurité renforcée</li>
              </ul>
            </div>
          </div>
        </template>

        <template #footer>
          <div style="text-align: center;">
            <p><strong>Besoin d'aide ?</strong></p>
            <p>📞 Support technique : 01 23 45 67 89</p>
            <p>💬 Chat en ligne : support.example.com</p>
            <p>📧 Email : maintenance@example.com</p>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">
              © 2024 Company Name - Tous droits réservés
            </p>
          </div>
        </template>
      </PMaintenance>
    `,
  }),
  args: {
    pIllustrationName: 'error-page-3',
  },
}

export const EmergencyMaintenance: Story = {
  render: (args) => ({
    components: { PMaintenance },
    setup() {
      return {
        args,
      }
    },
    template: `
      <PMaintenance v-bind="args">
        <template #title>
          <span>
            Maintenance d'
          </span>
          <span class="text-color--secondary-amethyste">urgence</span>
        </template>

        <template #subtitle>
          <div style="text-align: center;">
            <div style="color: #e74c3c; font-weight: bold; margin-bottom: 15px;">
              ⚠️ Maintenance d'urgence en cours
            </div>
            <p>Nous avons détecté un problème technique nécessitant une intervention immédiate.</p>
            <p>Nos équipes travaillent activement pour résoudre la situation.</p>
            <div style="margin: 20px 0; padding: 15px; background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; display: inline-block;">
              <p style="margin: 0; font-weight: bold;">Status actuel : Résolution en cours</p>
            </div>
          </div>
        </template>

        <template #footer>
          <div style="text-align: center;">
            <p style="color: #e74c3c; font-weight: bold;">Contact d'urgence</p>
            <p>📞 Hotline 24/7 : +33 1 23 45 67 89</p>
            <p>📧 Urgences : emergency@example.com</p>
            <p style="margin-top: 15px;">
              <a href="https://status.example.com" target="_blank" style="color: #007bff; text-decoration: none;">
                📊 Page de statut en temps réel
              </a>
            </p>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">
              Incident ID: #MAINT-2024-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}
            </p>
          </div>
        </template>
      </PMaintenance>
    `,
  }),
  args: {
    pIllustrationName: 'error-page-1',
  },
}

export const MinimalMaintenance: Story = {
  render: (args) => ({
    components: { PMaintenance },
    setup() {
      return {
        args,
      }
    },
    template: `
      <PMaintenance v-bind="args">
        <template #title>
          Service temporairement indisponible
        </template>

        <template #subtitle>
          Maintenance en cours. Service disponible prochainement.
        </template>

        <template #footer>
          Support : contact@example.com
        </template>
      </PMaintenance>
    `,
  }),
  args: {
    pIllustrationName: 'error-page-2',
  },
}
