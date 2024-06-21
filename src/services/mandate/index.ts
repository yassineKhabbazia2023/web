import { commonApi as api } from '@kpmg/common'
import type { BbanModel, CreateMandateModel } from '@/components/CreateMandate/Form/FormModels'
import type { SearchMandateParams } from './ServiceMandateTypes'

export const getCompany = ({
  ibsNumber,
}: { ibsNumber: string }): Promise<any> =>
  api().mandate.get(`/company/${ibsNumber}`)

export const downloadUnsignedMandate = async (mandateId: string) => {
  return await api().mandate.get(`/mandate/${mandateId}/unsigned`, {
    responseType: 'blob',
  })
}

export const downloadSignedMandate = async (mandateId: string) => {
  return await api().mandate.get(`/mandate/${mandateId}/signed`, {
    responseType: 'blob',
  })
}

export const terminateMandate = async (mandateId: string) => {
  return await api().mandate.post(`/mandate/${mandateId}/deactivate`)
}

export const validateIban = async ({
  bankCode,
  branchCode,
  accountNumber,
  checkDigits,
}: BbanModel) => {
  const { data: { valid } } = await api().mandate.get(
    'bank/check-bban-validity',
    { params: { bankCode, branchCode, accountNumber, checkDigits } },
  )
  return {
    valid,
  }
}

export const getBankDetail = async (bankCode: string) => {
  const { data } = await api().mandate.get(
    `bank/${bankCode}`)
  return data
}

export function parseParams(params: Record<string, any>) {
  const keys = Object.keys(params)
  const options: string[] = []

  keys.forEach((key) => {
    const param = params[key]
    const isParamTypeArray = Array.isArray(param)

    if (isParamTypeArray) {
      param
        .forEach(value => {
          options.push(`${key}=${value}`)
        })
    } else {
      options.push(`${key}=${param}`)
    }
  })

  return options.join('&')
}

export function getMandatesCollection(searchParams: SearchMandateParams) {
  const { currentPage, limit } = searchParams
  const params = {
    ...searchParams,
    skip: (currentPage - 1) * limit,
    currentPage: undefined,
  }
  return api().mandate.get('/mandate', {
    params,
    paramsSerializer: (params) => parseParams(params),
  })
}

export const createMandate = ({
  erpId,
  signatory,
  address,
  bban,
}: CreateMandateModel): Promise<any> =>
  api().mandate.post('/mandate', { erpId, signatory, address, bban })

export const uploadSignedMandate = async ({
  mandateId,
  file,
}: {mandateId: string, file: any}): Promise<any> => {
  const formData = new FormData()

  formData.append('file', file)

  return await api().mandate.post(
      `/mandate/${mandateId}/signed`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
  )
}
