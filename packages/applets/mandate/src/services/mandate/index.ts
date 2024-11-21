import type { Mandate } from '@mandate/pages/home/Models'
import { commonApi as api } from '@pulse/common'
import type { BbanModel, CreateMandateModel } from '@mandate/components/CreateMandate/Form/FormModels'
import type { SearchMandateParams } from './ServiceMandateTypes'
import { mandateAvailabilityCheckStatuses } from '@mandate/constants/mandateStatuses'

export const getCompany = ({
  ibsNumber,
}: { ibsNumber: string }): Promise<any> =>
  api().gateway.get(`mandate/api/company/currentuser/${ibsNumber}`)

export const downloadUnsignedMandate = async (mandateId: Mandate['id']) => {
  return await api().gateway.get(`mandate/api/mandate/${mandateId}/unsigned`, {
    responseType: 'blob',
  })
}

export const downloadSignedMandate = async (mandateId: Mandate['id']) => {
  return await api().gateway.get(`mandate/api/mandate/${mandateId}/signed`, {
    responseType: 'blob',
  })
}

export const terminateMandate = async (mandateId: Mandate['id']) => {
  return await api().gateway.post(`mandate/api/mandate/${mandateId}/deactivate/currentuser`)
}

export const validateIban = async ({
  bankCode,
  branchCode,
  accountNumber,
  checkDigits,
}: BbanModel) => {
  const { data: { valid } } = await api().gateway.get(
    'mandate/api/bank/check-bban-validity',
    { params: { bankCode, branchCode, accountNumber, checkDigits } },
  )
  return {
    valid,
  }
}

export const getBankDetail = async (bankCode: string) => {
  const { data } = await api().gateway.get(
    `mandate/api/bank/${bankCode}`)
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
  return api().gateway.get('mandate/api/mandate/currentuser', {
    params,
    paramsSerializer: (params) => parseParams(params),
  })
}

export async function getMandateAvailability(mandateId: Mandate['id']): Promise<number> {
  const { data, status } = await api().gateway.get(`mandate/api/mandate/${mandateId}/check/status`)

  if (status === 204) return mandateAvailabilityCheckStatuses.NOT_AVAILABLE
  return data.created === true
    ? mandateAvailabilityCheckStatuses.AVAILABLE
    : mandateAvailabilityCheckStatuses.ERRORED
}

export const createMandate = async ({
  erpId,
  signatory,
  address,
  bban,
}: CreateMandateModel): Promise<any> => {
  return await api().gateway.post('mandate/api/mandate/currentuser', { erpId, signatory, address, bban })
}

export const uploadSignedMandate = async ({
  mandateId,
  file,
}: {mandateId: string, file: any}): Promise<any> => {
  const formData = new FormData()

  formData.append('file', file)

  return await api().gateway.post(
        `/mandate/api/mandate/${mandateId}/signed/currentuser`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
  )
}
