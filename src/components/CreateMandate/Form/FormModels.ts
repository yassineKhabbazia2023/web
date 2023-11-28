interface Signatory{
    title: string
    firstName: string
    lastName: string
    email: string
}
interface Address {
    street: string
    addressComplement: string
    zipCode: string
    city: string
    country: string
}

export interface BbanModel {
    bankCode: string
    branchCode: string
    accountNumber: string
    checkDigits: string
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
    erpId: string
    address: Address
    signatory: Signatory
    bban: BbanModel
}
