export interface CompanyModel {
    id: string
    name: string
    siretNumber: string
    erpId: string
    signatory: {
        title: string
        firstName: string
        lastName: string
        email: string
    },
    address: {
        street: string
        addressComplement: string
        zipCode: string
        city: string
        country: string
    }
}

export interface BbanModel {
    bankCode: string
    branchCode: string
    accountNumber: string
    checkDigits: string
}

export interface CreateMandateFormModel {
    company: CompanyModel,
    bban: BbanModel
}

export interface Rule {
    required: boolean
    message: string
    trigger: 'change' | 'blur'
}

export interface Rules {
    ibs: Rule[]
    title: Rule[]
    firstName: Rule[]
    lastName: Rule[]
    address: Rule[]
    zipCode: Rule[]
    city: Rule[]
    country: Rule[]
}

export interface CreateMandateModel {
    erpId: Pick<CompanyModel, 'erpId' >
    address: Pick<CompanyModel, 'address' >
    signatory: Pick<CompanyModel, 'signatory' >
    bban: BbanModel
}
