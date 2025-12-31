import { http, HttpResponse } from 'msw'
import {
  getMockedBIReports,
  getMockedBIReportTypes,
  getMockReportTable,
  getMockReportStatistics,
  getMockReportErrors,
} from '@pulse/powerbi/mocks'
import { MockEntityId } from '@pulse/common/mocks'

export const powerbiHandlers = [
  // Fetch BI reports for an entity (customer view)
  http.get('*/reporting/api/reports/currentuser', ({ request }) => {
    const url = new URL(request.url)
    const accountId = Number(url.searchParams.get('accountId'))

    // No BI reports for basic entity
    if (accountId === MockEntityId.BASIC) {
      return HttpResponse.json({
        items: [],
        totalItems: 0,
        totalPage: 1,
        currentPage: 1,
      })
    }

    return HttpResponse.json({
      items: getMockedBIReports(),
      totalItems: getMockedBIReports().length,
      totalPage: 1,
      currentPage: 1,
    })
  }),

  // Fetch available reports (wallet/collaborator view)
  http.get('*/reporting/api/reports/available', () => {
    return HttpResponse.json({
      items: getMockReportTable(),
      totalItems: getMockReportTable().length,
      totalPage: 1,
      currentPage: 1,
    })
  }),

  // Fetch report statistics
  http.get('*/reporting/api/reports/statistics', () => {
    return HttpResponse.json(getMockReportStatistics())
  }),

  // Fetch report errors
  http.get('*/reporting/api/report-errors', () => {
    return HttpResponse.json({
      items: getMockReportErrors(),
      totalItems: getMockReportErrors().length,
      totalPage: 1,
      currentPage: 1,
    })
  }),

  // Fetch report types
  http.get('*/reporting/api/reportType', () => {
    return HttpResponse.json(getMockedBIReportTypes())
  }),

  // Fetch embed token for a report
  http.get('*/reporting/api/reports/:reportId/embedToken', () => {
    return HttpResponse.json('mock-embed-token-for-storybook')
  }),

  // Update report status
  http.patch('*/reporting/api/reports', () => {
    return HttpResponse.json({ success: true })
  }),

  // Delete report
  http.delete('*/reporting/api/reports', () => {
    return HttpResponse.json({ success: true })
  }),

  // Upload BI report
  http.post('*/reporting/api/reports/currentuser', () => {
    return HttpResponse.json({ success: true })
  }),
]
