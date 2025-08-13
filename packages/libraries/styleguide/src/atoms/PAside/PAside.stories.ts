import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PAside from './PAside.vue'

const meta: Meta<typeof PAside> = {
  title: 'Atoms/PAside',
  component: PAside,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Composant de barre latérale basé sur Element Plus avec largeur personnalisable.',
      },
    },
  },
  argTypes: {
    pWidth: {
      control: 'text',
      description: 'Largeur de la barre latérale',
    },
  },
  args: {
    pWidth: '300px',
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  render: (args) => ({
    components: { PAside },
    setup() {
      return { args }
    },
    template: `
      <div style="height: 400px; display: flex;">
        <PAside v-bind="args">
          <div style="padding: 16px;">
            <h3>Navigation</h3>
            <ul style="list-style: none; padding: 0; margin: 16px 0;">
              <li style="padding: 8px 0;"><a href="#">Accueil</a></li>
              <li style="padding: 8px 0;"><a href="#">Produits</a></li>
              <li style="padding: 8px 0;"><a href="#">Services</a></li>
              <li style="padding: 8px 0;"><a href="#">Contact</a></li>
            </ul>
          </div>
        </PAside>
        <div style="flex: 1; padding: 16px; background: #f5f5f5;">
          <h2>Contenu principal</h2>
          <p>Le contenu principal de la page se trouve ici.</p>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Barre latérale par défaut avec une largeur de 300px.',
      },
    },
  },
}

// Different widths
export const Widths: Story = {
  render: () => ({
    components: { PAside },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h3 style="margin-bottom: 8px;">Étroite (200px)</h3>
          <div style="height: 200px; display: flex; border: 1px solid #ddd;">
            <PAside pWidth="200px">
              <div style="padding: 16px;">
                <h4>Navigation</h4>
                <nav>
                  <ul style="list-style: none; padding: 0; margin: 8px 0;">
                    <li style="padding: 4px 0;"><a href="#">Accueil</a></li>
                    <li style="padding: 4px 0;"><a href="#">Produits</a></li>
                  </ul>
                </nav>
              </div>
            </PAside>
            <div style="flex: 1; padding: 16px; background: #f9f9f9;">
              <p>Contenu avec sidebar étroite</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 8px;">Moyenne (300px)</h3>
          <div style="height: 200px; display: flex; border: 1px solid #ddd;">
            <PAside pWidth="300px">
              <div style="padding: 16px;">
                <h4>Navigation</h4>
                <nav>
                  <ul style="list-style: none; padding: 0; margin: 8px 0;">
                    <li style="padding: 6px 0;"><a href="#">Accueil</a></li>
                    <li style="padding: 6px 0;"><a href="#">Produits</a></li>
                    <li style="padding: 6px 0;"><a href="#">Services</a></li>
                  </ul>
                </nav>
              </div>
            </PAside>
            <div style="flex: 1; padding: 16px; background: #f9f9f9;">
              <p>Contenu avec sidebar moyenne</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 8px;">Large (400px)</h3>
          <div style="height: 200px; display: flex; border: 1px solid #ddd;">
            <PAside pWidth="400px">
              <div style="padding: 16px;">
                <h4>Navigation étendue</h4>
                <nav>
                  <ul style="list-style: none; padding: 0; margin: 8px 0;">
                    <li style="padding: 8px 0;"><a href="#">Accueil</a></li>
                    <li style="padding: 8px 0;"><a href="#">Produits et Services</a></li>
                    <li style="padding: 8px 0;"><a href="#">À propos de nous</a></li>
                    <li style="padding: 8px 0;"><a href="#">Contact et Support</a></li>
                  </ul>
                </nav>
              </div>
            </PAside>
            <div style="flex: 1; padding: 16px; background: #f9f9f9;">
              <p>Contenu avec sidebar large</p>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Différentes largeurs de barre latérale : 200px, 300px, 400px.',
      },
    },
  },
}

// Navigation content
export const NavigationContent: Story = {
  render: () => ({
    components: { PAside },
    template: `
      <div style="height: 500px; display: flex;">
        <PAside pWidth="280px">
          <div style="padding: 20px;">
            <div style="margin-bottom: 24px;">
              <h3 style="margin: 0 0 16px 0; color: #333;">Menu Principal</h3>
              <nav>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="margin-bottom: 8px;">
                    <a href="#" style="display: block; padding: 8px 12px; text-decoration: none; color: #666; border-radius: 4px; transition: background 0.2s;" 
                       onmouseover="this.style.background='#f0f0f0'" 
                       onmouseout="this.style.background='transparent'">
                      🏠 Tableau de bord
                    </a>
                  </li>
                  <li style="margin-bottom: 8px;">
                    <a href="#" style="display: block; padding: 8px 12px; text-decoration: none; color: #666; border-radius: 4px; transition: background 0.2s;"
                       onmouseover="this.style.background='#f0f0f0'" 
                       onmouseout="this.style.background='transparent'">
                      📊 Analytics
                    </a>
                  </li>
                  <li style="margin-bottom: 8px;">
                    <a href="#" style="display: block; padding: 8px 12px; text-decoration: none; color: #666; border-radius: 4px; transition: background 0.2s;"
                       onmouseover="this.style.background='#f0f0f0'" 
                       onmouseout="this.style.background='transparent'">
                      👥 Utilisateurs
                    </a>
                  </li>
                  <li style="margin-bottom: 8px;">
                    <a href="#" style="display: block; padding: 8px 12px; text-decoration: none; color: #666; border-radius: 4px; transition: background 0.2s;"
                       onmouseover="this.style.background='#f0f0f0'" 
                       onmouseout="this.style.background='transparent'">
                      ⚙️ Paramètres
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 16px;">
              <h4 style="margin: 0 0 12px 0; color: #666; font-size: 14px;">Outils</h4>
              <nav>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="margin-bottom: 6px;">
                    <a href="#" style="display: block; padding: 6px 12px; text-decoration: none; color: #888; font-size: 14px; border-radius: 4px;"
                       onmouseover="this.style.background='#f0f0f0'" 
                       onmouseout="this.style.background='transparent'">
                      📋 Rapports
                    </a>
                  </li>
                  <li style="margin-bottom: 6px;">
                    <a href="#" style="display: block; padding: 6px 12px; text-decoration: none; color: #888; font-size: 14px; border-radius: 4px;"
                       onmouseover="this.style.background='#f0f0f0'" 
                       onmouseout="this.style.background='transparent'">
                      📁 Documents
                    </a>
                  </li>
                  <li>
                    <a href="#" style="display: block; padding: 6px 12px; text-decoration: none; color: #888; font-size: 14px; border-radius: 4px;"
                       onmouseover="this.style.background='#f0f0f0'" 
                       onmouseout="this.style.background='transparent'">
                      💬 Support
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </PAside>
        <div style="flex: 1; padding: 24px; background: #fafafa;">
          <h2>Zone de contenu principal</h2>
          <p>Le contenu de l'application s'affiche dans cette zone.</p>
          <div style="background: white; padding: 16px; border-radius: 8px; margin-top: 16px;">
            <h3>Widget exemple</h3>
            <p>Un widget ou composant pourrait être affiché ici.</p>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Exemple de navigation structurée avec menu principal et outils.',
      },
    },
  },
}

// Responsive behavior
export const ResponsiveBehavior: Story = {
  render: () => ({
    components: { PAside },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h3 style="margin-bottom: 8px;">Desktop (large écran)</h3>
          <div style="height: 250px; display: flex; border: 1px solid #ddd;">
            <PAside pWidth="320px">
              <div style="padding: 20px;">
                <h4>Navigation complète</h4>
                <nav>
                  <ul style="list-style: none; padding: 0; margin: 12px 0;">
                    <li style="padding: 8px 0;"><a href="#">📊 Tableau de bord</a></li>
                    <li style="padding: 8px 0;"><a href="#">👥 Gestion des utilisateurs</a></li>
                    <li style="padding: 8px 0;"><a href="#">📈 Statistiques avancées</a></li>
                    <li style="padding: 8px 0;"><a href="#">⚙️ Configuration système</a></li>
                  </ul>
                </nav>
              </div>
            </PAside>
            <div style="flex: 1; padding: 20px; background: #f8f9fa;">
              <p>Contenu optimisé pour grand écran</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 8px;">Tablet (écran moyen)</h3>
          <div style="height: 250px; display: flex; border: 1px solid #ddd; max-width: 768px;">
            <PAside pWidth="250px">
              <div style="padding: 16px;">
                <h4>Navigation</h4>
                <nav>
                  <ul style="list-style: none; padding: 0; margin: 10px 0;">
                    <li style="padding: 6px 0;"><a href="#">📊 Dashboard</a></li>
                    <li style="padding: 6px 0;"><a href="#">👥 Users</a></li>
                    <li style="padding: 6px 0;"><a href="#">📈 Stats</a></li>
                    <li style="padding: 6px 0;"><a href="#">⚙️ Settings</a></li>
                  </ul>
                </nav>
              </div>
            </PAside>
            <div style="flex: 1; padding: 16px; background: #f8f9fa;">
              <p>Contenu adapté tablette</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 8px;">Mobile (petit écran)</h3>
          <div style="height: 250px; display: flex; border: 1px solid #ddd; max-width: 480px;">
            <PAside pWidth="180px">
              <div style="padding: 12px;">
                <nav>
                  <ul style="list-style: none; padding: 0; margin: 8px 0; font-size: 14px;">
                    <li style="padding: 4px 0;"><a href="#">📊</a></li>
                    <li style="padding: 4px 0;"><a href="#">👥</a></li>
                    <li style="padding: 4px 0;"><a href="#">📈</a></li>
                    <li style="padding: 4px 0;"><a href="#">⚙️</a></li>
                  </ul>
                </nav>
              </div>
            </PAside>
            <div style="flex: 1; padding: 12px; background: #f8f9fa; font-size: 14px;">
              <p>Contenu mobile</p>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Comportement adaptatif de la barre latérale selon la taille d\'écran.',
      },
    },
  },
}

// All variants showcase
export const AllVariants: Story = {
  render: () => ({
    components: { PAside },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px;">
        <div>
          <h3 style="margin-bottom: 16px;">Largeurs disponibles</h3>
          <div style="display: flex; gap: 16px; height: 200px;">
            <div style="border: 1px solid #ddd; display: flex;">
              <PAside pWidth="150px">
                <div style="padding: 12px; font-size: 12px;">
                  <p>150px</p>
                </div>
              </PAside>
              <div style="width: 100px; padding: 8px; background: #f9f9f9; font-size: 12px;">Contenu</div>
            </div>
            
            <div style="border: 1px solid #ddd; display: flex;">
              <PAside pWidth="250px">
                <div style="padding: 12px; font-size: 12px;">
                  <p>250px</p>
                </div>
              </PAside>
              <div style="width: 100px; padding: 8px; background: #f9f9f9; font-size: 12px;">Contenu</div>
            </div>
            
            <div style="border: 1px solid #ddd; display: flex;">
              <PAside pWidth="350px">
                <div style="padding: 12px; font-size: 12px;">
                  <p>350px</p>
                </div>
              </PAside>
              <div style="width: 100px; padding: 8px; background: #f9f9f9; font-size: 12px;">Contenu</div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 16px;">Cas d'usage typiques</h3>
          <div style="height: 300px; display: flex; border: 1px solid #ddd;">
            <PAside pWidth="280px">
              <div style="padding: 16px;">
                <h4 style="margin: 0 0 16px 0;">Menu Application</h4>
                <nav>
                  <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="margin-bottom: 8px;">
                      <a href="#" style="display: flex; align-items: center; padding: 8px; text-decoration: none; color: #333; border-radius: 4px; background: #e3f2fd;">
                        📊 <span style="margin-left: 8px;">Dashboard</span>
                      </a>
                    </li>
                    <li style="margin-bottom: 8px;">
                      <a href="#" style="display: flex; align-items: center; padding: 8px; text-decoration: none; color: #666; border-radius: 4px;">
                        👥 <span style="margin-left: 8px;">Utilisateurs</span>
                      </a>
                    </li>
                    <li style="margin-bottom: 8px;">
                      <a href="#" style="display: flex; align-items: center; padding: 8px; text-decoration: none; color: #666; border-radius: 4px;">
                        📁 <span style="margin-left: 8px;">Documents</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" style="display: flex; align-items: center; padding: 8px; text-decoration: none; color: #666; border-radius: 4px;">
                        ⚙️ <span style="margin-left: 8px;">Paramètres</span>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </PAside>
            <div style="flex: 1; padding: 20px; background: #fafafa;">
              <h2>Interface principale</h2>
              <p>Le contenu de l'application s'affiche dans cette zone avec une navigation claire et accessible.</p>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Aperçu complet de toutes les variantes du composant PAside.',
      },
    },
  },
}
