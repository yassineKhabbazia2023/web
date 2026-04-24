import { getInitials } from '@entities/helpers'
import type { Contact } from '@entities/services/contact/contactTypes'
import type { CollaboratorRole, ContactWithRoles } from '@entities/types'
import type { PDropdownOption } from '@pulse/styleguide/types'
import { getFullName } from '@pulse/common/utils'

export function getUserActionOptions(
  collaboratorRoles: CollaboratorRole[],
  usedCollaboratorRoleIds: number[],
): PDropdownOption[] {
  return collaboratorRoles
    .filter(({ functionId }) => !usedCollaboratorRoleIds.includes(functionId))
    .map(({
      functionId: pValue,
      functionName: pLabel,
    }) => ({
      pValue,
      pLabel,
    }))
}

export function getFormattedCollaborator(
  knownCollaborators: Contact[],
  selectedCollaboratorId: ContactWithRoles,
  collaboratorRoles: CollaboratorRole[],
  usedCollaboratorRoleIds: number[],
) {
  const { contactId, roleIds } = selectedCollaboratorId
  const contact = knownCollaborators.find((contact) => contact.id === contactId)
  if (!contact) {
    return
  }
  const hasCollaboratorRole = collaboratorRoles.length > 0
  const profile = getInitials(contact.firstName, contact.lastName)
  const fullName = getFullName(contact.firstName, contact.lastName)
  const dataTestId = `offer-selected-collaborator-${contact.email}`
  const role = hasCollaboratorRole ? '' : (contact.persona?.name ?? '')
  const availableRoles = getUserActionOptions(collaboratorRoles, usedCollaboratorRoleIds)

  return {
    ...contact,
    profile,
    fullName,
    dataTestId,
    roleIds,
    role,
    availableRoles,
  }
}

export function getFormattedCollaborators(
  knownCollaborators: Contact[],
  selectedCollaboratorsWithRoles: ContactWithRoles[],
  collaboratorRoles: CollaboratorRole[],
) {
  const formattedCollaborators: ReturnType<typeof getFormattedCollaborator>[] = []
  const usedCollaboratorRoleIds = selectedCollaboratorsWithRoles
    .flatMap(({ roleIds }) => roleIds.map(roleId => roleId))

  selectedCollaboratorsWithRoles
    .forEach(selectedCollaboratorId => {
      const otherUsedCollaboratorRoleIds = usedCollaboratorRoleIds
        .filter((roleId) => !selectedCollaboratorId.roleIds.includes(roleId))
      const formattedCollaborator = getFormattedCollaborator(
        knownCollaborators,
        selectedCollaboratorId,
        collaboratorRoles,
        otherUsedCollaboratorRoleIds,
      )
      formattedCollaborators.push(formattedCollaborator)
      usedCollaboratorRoleIds.push(...selectedCollaboratorId.roleIds)
    })

  return formattedCollaborators
    .filter(formattedCollaborator => formattedCollaborator !== undefined)
}
