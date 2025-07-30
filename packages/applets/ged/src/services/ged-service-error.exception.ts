import type { Service } from '@ged/models/Service'

// Class to handle service loading errors
export class GedServiceError extends Error {
  public readonly service: Service

  constructor(message: string, service: Service) {
    super(message)
    this.name = 'ServiceError'
    this.service = service
  }
}
