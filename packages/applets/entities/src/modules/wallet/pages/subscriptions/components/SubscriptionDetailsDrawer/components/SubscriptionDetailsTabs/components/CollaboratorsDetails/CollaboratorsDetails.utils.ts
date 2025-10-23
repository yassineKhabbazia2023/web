import type { SubscriptionContact } from '@entities/services/subscription/subscriptionTypes'
import type { CollaboratorRole } from '@entities/types'

export function getFormattedCollaborator(
  collaborator: SubscriptionContact,
) {
  const {
    contactId,
    firstName,
    lastName,
    email,
    functionId,
  } = collaborator
  const functionIds = functionId ? [functionId] : []

  return {
    contactId,
    firstName,
    lastName,
    email,
    functionIds,
  }
}

export function getFormattedCollaborators(
  collaborators: SubscriptionContact[],
) {
  const formattedCollaborators: {
    contactId: number,
    firstName: string,
    lastName: string,
    email: string,
    functionIds: number[],
  }[] = []
  return collaborators.reduce((formattedCollaborators, collaborator) => {
    const formattedCollaborator = formattedCollaborators
      .find(({ contactId }) => contactId === collaborator.contactId)
    if (formattedCollaborator) {
      if (collaborator.functionId) {
        formattedCollaborator.functionIds.push(collaborator.functionId)
      }
    } else {
      formattedCollaborators.push(getFormattedCollaborator(collaborator))
    }
    return formattedCollaborators
  }, formattedCollaborators)
}

export function getFormattedCollaboratorRoles(
  collaboratorRoles: CollaboratorRole[],
) {
  return collaboratorRoles.map(({
    functionId: pValue,
    functionName: pLabel,
  }) => ({
    pValue,
    pLabel,
  }))
}
