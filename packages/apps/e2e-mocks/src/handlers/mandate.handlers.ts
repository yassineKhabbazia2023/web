import { http, HttpResponse } from 'msw'
import {
  getMockedMandatesList,
  getMockedCompany,
} from '@pulse/mandate/mocks'

export const mandateHandlers = [
  // Fetch mandates collection for current user
  http.get('*/mandate/api/mandate/currentuser', () => {
    return HttpResponse.json(getMockedMandatesList())
  }),

  // Fetch company details
  http.get('*/mandate/api/company/currentuser/:ibsNumber', () => {
    return HttpResponse.json(getMockedCompany())
  }),

  // Download unsigned mandate
  http.get('*/mandate/api/mandate/:mandateId/unsigned', async () => {
    const response = await fetch('/assets/sample.pdf')
    const buffer = await response.arrayBuffer()
    return new HttpResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
      },
    })
  }),

  // Download signed mandate
  http.get('*/mandate/api/mandate/:mandateId/signed', async () => {
    const response = await fetch('/assets/sample.pdf')
    const buffer = await response.arrayBuffer()
    return new HttpResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
      },
    })
  }),

  // Terminate mandate
  http.post('*/mandate/api/mandate/:mandateId/deactivate/currentuser', () => {
    return HttpResponse.json({ success: true })
  }),

  // Validate BBAN
  http.get('*/mandate/api/bank/check-bban-validity', () => {
    return HttpResponse.json({ valid: true })
  }),

  // Get bank details
  http.get('*/mandate/api/bank/:bankCode', () => {
    return HttpResponse.json({
      bankCode: '12310',
      bankName: 'Crédit Agricole',
    })
  }),

  // Check mandate status/availability
  http.get('*/mandate/api/mandate/:mandateId/check/status', () => {
    return HttpResponse.json({ created: true })
  }),

  // Create mandate
  http.post('*/mandate/api/mandate/currentuser', () => {
    return HttpResponse.json({ success: true, id: 'new-mandate-id' })
  }),

  // Upload signed mandate
  http.post('*/mandate/api/mandate/:mandateId/signed/currentuser', () => {
    return HttpResponse.json({ success: true })
  }),
]
