export interface BookingServiceConfiguration {
  contactId: number
  link: string
  isActive: boolean
  creationDate: string
  updatedDate: string
}

export interface BookingServiceExpert {
  contactId: number
  link: string
  fullName: string
  email: string
}
