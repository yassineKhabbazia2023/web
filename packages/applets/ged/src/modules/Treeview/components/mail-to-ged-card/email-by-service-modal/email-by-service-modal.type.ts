import { ServiceMailToGedInformation } from '@ged/models/Service'

export interface EmailByServiceProps {
  isOpened: boolean
  mailToGedInformation: ServiceMailToGedInformation[]
}
