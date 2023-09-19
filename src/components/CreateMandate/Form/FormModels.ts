export interface FormModel {
    [key: string]: string;
    ibs: string;
    siretNumber: string;
    name: string;
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    addressComplement: string;
    zipCode: string;
    city: string;
    country: string;
}

export interface Rule {
    required: boolean;
    message: string;
    trigger: 'change' | 'blur';
}

export interface Rules {
    ibs: Rule[];
    title: Rule[];
    firstName: Rule[];
    lastName: Rule[];
    address: Rule[];
    zipCode: Rule[];
    city: Rule[];
    country: Rule[];
}
