import type { Service } from '@ged/models/Service'

export interface EmailPennylaneModalProps {
    isVisible: boolean
    accountNumber: string
    accountId: number
    entityServices: Service[]
}
