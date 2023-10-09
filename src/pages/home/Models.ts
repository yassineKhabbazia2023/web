export interface Mandate {
    id: string
    erpId: string
    companyName: string
    accountNumber: string
    bankName: string
    creationDate: string
    modificationDate: string
    statusCode: string
}

export interface MandateCounters {
    all: number
    status10: number
    status20: number
    status30: number
    status40: number
    status50: number
}

export interface MandateCollection {
    counters: MandateCounters
    data: Mandate[]
}

