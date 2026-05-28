import { SortingCriteria } from './api.types'

export interface SearchCriteria {
  currentPage: number
  limit: number
  search?: string
  sorting?: SortingCriteria
  accountNumber?: string
  filterByDeploymentStatus?: string
  isFavoriteFilter?: boolean
  isCustomerRelationFilter?: boolean
}

export interface FilterQueryParams {
  pageNumber: number,
  pageSize: number,
  search?: string,
  'sorting.field': string | undefined,
  'sorting.descending': boolean | undefined,
  accountNumber?: string,
  deploymentStatus?: string,
  isFavoriteFilter?: boolean
  isCustomerRelationFilter?: boolean
}

export interface Office {
  officeId: number;
  name: string;
  phoneNumber: string;
  addressId: number;
  address?: Address;
}

export interface Address {
  addressId: number
  addressLine1?: string
  addressLine2?: string
  addressLine3?: string
  addressType?: 'delivery' | 'billing'
  state?: string
  zipCode?: string
  country?: string
  city?: string
  latitude?: number
  longitude?: number
}

export interface Subscription {
  subscriptionId: number
  offerId: number
  status?: 'validated' | 'rejected' | 'pending' | 'pending-migration' | 'failed-migration'
  accountId: number
  offerCode: string
  offerName: string
  creationDate: string
  validator?: string
}

export interface Deployment {
  deploymentId: number
  deploymentDate?: string
  status: number
}

export interface Signatory {
  contactId: number
  globalContactId: string
  firstName: string
  lastName: string
  email: string
  status: string
  personaName: string
  creationDate: string
}

export interface Hub {
  hubId: number
  hubName?: string
}

export interface AccountRow {
  accountId: number
  accountGlobalUniqueId: string
  accountNumber: string
  legalName: string
  isFavorite: boolean
  address: Address
  hub: Hub
  signatory: Signatory
  deployment: Deployment
}

