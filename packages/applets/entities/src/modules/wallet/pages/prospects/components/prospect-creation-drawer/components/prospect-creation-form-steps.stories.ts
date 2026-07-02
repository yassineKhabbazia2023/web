import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { PButton, PDrawer, PTitle } from '@pulse/styleguide/components'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import { ProspectEligibilityStatus } from '@entities/modules/wallet/enums'
import type { Contact } from '@entities/services/contact/contactTypes'
import type { CollaboratorTargetRole, ProspectFormData } from '@entities/modules/wallet/types'
import ProspectCreationStepInformation from './prospect-creation-step-information/prospect-creation-step-information.form.vue'
import ProspectCreationStepCompany from './prospect-creation-step-company/prospect-creation-step-company.form.vue'
import ProspectCreationStepContact from './prospect-creation-step-contact/prospect-creation-step-contact.form.vue'
import {
  getDropdownsContentMock,
  getProspectEntitySearchResultMock,
  getProspectFormDataMock,
} from '../__mocks__'

// The 3 form steps of the prospect creation drawer, gathered under a single title so their
// declaration order in this file — Information, then Company, then Contact — drives the sidebar
// order directly, without needing any global Storybook sort configuration.

const dropdownsContent = getDropdownsContentMock()

// Stubs the entity search/eligibility calls so the search field works offline in Storybook.
function stubEntitySearch(): void {
  ProspectsService.searchEntities = (query) => Promise.resolve(
    query === '' ? [] : [getProspectEntitySearchResultMock()],
  )
  ProspectsService.checkProspectCreationEligibility = () => Promise.resolve(ProspectEligibilityStatus.ELIGIBLE)
}

const CASE_MANAGER_ROLE_ID = 1
const ACCOUNT_MANAGER_ROLE_ID = 2

const collaboratorTargetRoles: CollaboratorTargetRole[] = [
  { id: CASE_MANAGER_ROLE_ID, labelKey: 'MASTER_OF_FILE', label: 'Maître de dossier', isMandatory: true },
  { id: ACCOUNT_MANAGER_ROLE_ID, labelKey: 'ACCOUNT_MANAGER', label: 'Responsable de compte', isMandatory: true },
]

function getContactMock(overrides: Partial<Contact> = {}): Contact {
  return {
    id: 1,
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice.smith@example.com',
    mobilePhone: '0600000000',
    ...overrides,
  }
}

// Stubs the collaborator search so it works offline in Storybook.
function stubCollaboratorSearch(): void {
  ProspectsService.fetchCollaborators = () => Promise.resolve([
    getContactMock({ id: 3, firstName: 'Chloé', lastName: 'Martin', email: 'chloe.martin@example.com' }),
  ])
}

const meta: Meta<typeof ProspectCreationStepInformation> = {
  title: 'Applets/Entities/Wallet/Prospects/Creation',
  component: ProspectCreationStepInformation,
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Renders a step component inside the same PDrawer chrome as the real prospect creation flow.
function renderInDrawer(setup: () => Record<string, unknown>, template: string): Story['render'] {
  return () => ({
    components: { ProspectCreationStepInformation, ProspectCreationStepCompany, ProspectCreationStepContact, PButton, PDrawer, PTitle },
    setup() {
      const isOpen = ref(true)
      return { isOpen, ...setup() }
    },
    template: `
      <div style="padding: 24px;">
        <PButton
          pType="primary"
          :pDisabled="isOpen"
          @click="isOpen = true"
        >
          Ouvrir le drawer
        </PButton>
        <PDrawer
          v-model="isOpen"
          pSize="50%"
          @close-drawer-button="isOpen = false"
        >
          <template #header-prefix>
            <PTitle pTitle="Ajouter un prospect" />
          </template>
          ${template}
        </PDrawer>
      </div>
    `,
  })
}

// === 1. Information ===

// Leader section empty, no entity searched/selected yet.
export const InformationEmpty: Story = {
  name: '1. Informations - Vide',
  render: renderInDrawer(
    () => {
      stubEntitySearch()
      return { formData: ref(getProspectFormDataMock()), dropdownsContent }
    },
    '<ProspectCreationStepInformation v-model="formData" :dropdownsContent="dropdownsContent" />',
  ),
}

// Leader filled in and an entity already selected via the search, showing the summary card and its
// clear action.
export const InformationEntitySelected: Story = {
  name: '1. Informations - Entité sélectionnée',
  render: renderInDrawer(
    () => {
      stubEntitySearch()
      const formData = ref(getProspectFormDataMock({
        legalName: 'ACME Corp',
        siret: '93033121000003',
        siren: '930331210',
        signatory: {
          title: 'M',
          lastName: 'Ben Amor',
          firstName: 'Oussema',
          jobTitle: 'Gérant',
          department: 'DG',
          companyRole: 'Autre',
          contactTypes: ['isMandateSignatory'],
          email: 'obenamor@example.com',
          mobilePhone: '0612345678',
        },
      }))
      return { formData, dropdownsContent }
    },
    '<ProspectCreationStepInformation v-model="formData" :dropdownsContent="dropdownsContent" />',
  ),
}

// === 2. Company ===

// Company info as filled in by the entity selected in the previous step: read-only identity/address
// fields, plus the editable legal form and legal structure dropdowns.
export const CompanyDefault: Story = {
  name: '2. Société',
  render: renderInDrawer(
    () => {
      const formData = ref(getProspectFormDataMock({
        legalName: 'ACME Corp',
        siren: '930331210',
        siret: '93033121000003',
        legalForm: 'SAS',
        legalStructure: 'PersonneMorale',
        nafCode: '6201Z',
        address: '1 rue de la Paix',
        zipCode: '75001',
        city: 'Paris',
        department: 'Paris',
        region: 'Île-de-France',
        country: 'France',
      }))
      return { formData, dropdownsContent }
    },
    '<ProspectCreationStepCompany v-model="formData" :dropdownsContent="dropdownsContent" />',
  ),
}

// === 3. Contact ===

function getContactFormData(overrides: Partial<ProspectFormData> = {}): ProspectFormData {
  stubCollaboratorSearch()
  return getProspectFormDataMock(overrides)
}

// No collaborator added yet.
export const ContactEmpty: Story = {
  name: '3. Contacts - Vide',
  render: renderInDrawer(
    () => ({ formData: ref(getContactFormData()), collaboratorTargetRoles }),
    '<ProspectCreationStepContact v-model="formData" :collaboratorTargetRoles="collaboratorTargetRoles" />',
  ),
}

// Each mandatory role assigned to a different collaborator.
export const ContactOneRolePerCollaborator: Story = {
  name: '3. Contacts - Un rôle par collaborateur',
  render: renderInDrawer(
    () => {
      const alice = getContactMock()
      const bob = getContactMock({ id: 2, firstName: 'Bob', lastName: 'Dupont', email: 'bob.dupont@example.com' })
      const formData = ref(getContactFormData({
        interlocutors: [alice, bob],
        interlocutorRoles: {
          [alice.id]: [CASE_MANAGER_ROLE_ID],
          [bob.id]: [ACCOUNT_MANAGER_ROLE_ID],
        },
      }))
      return { formData, collaboratorTargetRoles }
    },
    '<ProspectCreationStepContact v-model="formData" :collaboratorTargetRoles="collaboratorTargetRoles" />',
  ),
}

// A single collaborator holds both mandatory roles at once: every role is taken, so the "add
// collaborator" search becomes disabled.
export const ContactSingleCollaboratorBothRoles: Story = {
  name: '3. Contacts - Les deux rôles pour un même collaborateur',
  render: renderInDrawer(
    () => {
      const alice = getContactMock()
      const formData = ref(getContactFormData({
        interlocutors: [alice],
        interlocutorRoles: {
          [alice.id]: [CASE_MANAGER_ROLE_ID, ACCOUNT_MANAGER_ROLE_ID],
        },
      }))
      return { formData, collaboratorTargetRoles }
    },
    '<ProspectCreationStepContact v-model="formData" :collaboratorTargetRoles="collaboratorTargetRoles" />',
  ),
}
