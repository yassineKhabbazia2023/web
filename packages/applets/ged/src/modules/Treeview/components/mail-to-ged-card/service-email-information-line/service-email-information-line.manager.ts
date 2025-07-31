import { PNotification } from '@pulse/styleguide'

export async function copyServiceEmailToClipboard(email: string) {
  try {
    await navigator.clipboard.writeText(email)
    PNotification(
      {
        message: 'L\'e-mail a été copié dans votre presse-papier.',
        iconName: 'check',
        showClose: true,
        customClass: 'success',
        position: 'bottom-right',
        duration: 3000,
      })
  } catch (error) {
    PNotification(
      {
        message: `Une erreur est survenue lors de la copie de l'adresse mail: ${error}`,
        iconName: 'exclamationTriangle',
        showClose: true,
        customClass: 'error',
        position: 'bottom-right',
        duration: 3000,
      })
  }
}
