import { describe } from 'vitest'
import { DocumentConsultationSource } from './tracking.types'
import { AmplitudeService as AmplitudeServiceMock } from '@pulse/common/services/amplitude'
import { GedContext } from '@pulse/common/enums'

import {
  trackDepositedDocument,
  trackDocumentDelete,
  trackDocumentDownload,
  trackDocumentMove,
  trackDocumentRename,
  trackDocumentSearch,
  trackDocumentTransmit,
  trackDocumentConsulted,
} from '@ged/services/tracking/tracking.service'

vi.mock('@pulse/common/services/amplitude')

const successValue = 'succeeded'
const failValue = 'failed'

describe('document deposit tracking', () => {
  it('tracks the deposit of documents', () => {
    const payload = {
      serviceName: 'A Cool Service Name',
      depositedDocumentsCount: 10,
      successfulDepositsCount: 8,
      failedDepositsCount: 2,
      destinationFolder: 'Awesome Folder',
    }
    const lowerCasedServiceName = payload.serviceName.toLowerCase()
    trackDepositedDocument(payload)

    expect(AmplitudeServiceMock.track).toHaveBeenCalledWith(
      'Deposit Document Completed',
      {
        document_deposit_category: lowerCasedServiceName,
        document_deposit_count: payload.depositedDocumentsCount,
        document_deposit_succeeded: payload.successfulDepositsCount,
        document_deposit_failed: payload.failedDepositsCount,
        document_deposit_folder: payload.destinationFolder,
      },
    )
  })
})

describe('document move tracking', () => {
  it.each([
    {
      hasSucceeded: { isMoveSuccessful: true },
      expectedValue: successValue,
    },
    {
      hasSucceeded: { isMoveSuccessful: false },
      expectedValue: failValue,
    },
  ])('tracks document move success', ({ hasSucceeded, expectedValue }) => {
    trackDocumentMove(hasSucceeded)
    expect(AmplitudeServiceMock.track).toHaveBeenCalledWith('Document Moved Completed', {
      document_move_result: expectedValue,
    })
  })
})

describe('document rename tracking', () => {
  it.each([
    {
      hasSucceeded: { isRenameSuccessful: true },
      expectedValue: successValue,
    },
    {
      hasSucceeded: { isRenameSuccessful: false },
      expectedValue: failValue,
    },
  ])('tracks document rename success', ({ hasSucceeded, expectedValue }) => {
    trackDocumentRename(hasSucceeded)
    expect(AmplitudeServiceMock.track).toHaveBeenCalledWith('Document Renamed', {
      document_rename: expectedValue,
    })
  })
})

describe('document delete tracking', () => {
  it.each([
    {
      hasSucceeded: { isDeleteSuccessful: true },
      expectedValue: successValue,
    },
    {
      hasSucceeded: { isDeleteSuccessful: false },
      expectedValue: failValue,
    },
  ])('tracks document rename success', ({ hasSucceeded, expectedValue }) => {
    trackDocumentDelete(hasSucceeded)
    expect(AmplitudeServiceMock.track).toHaveBeenCalledWith('Document Deleted', {
      document_delete: expectedValue,
    })
  })
})

describe('document download tracking', () => {
  it.each([
    {
      hasSucceeded: { isDownloadSuccessful: true },
      expectedValue: successValue,
    },
    {
      hasSucceeded: { isDownloadSuccessful: false },
      expectedValue: failValue,
    },
  ])('tracks document rename success', ({ hasSucceeded, expectedValue }) => {
    trackDocumentDownload(hasSucceeded)
    expect(AmplitudeServiceMock.track).toHaveBeenCalledWith('Document Downloaded', {
      document_download: expectedValue,
    })
  })
})

describe('document transmit tracking', () => {
  it.each([
    {
      hasSucceeded: { isTransmitSuccessful: true },
      expectedValue: successValue,
    },
    {
      hasSucceeded: { isTransmitSuccessful: false },
      expectedValue: failValue,
    },
  ])('tracks document transmit success', ({ hasSucceeded, expectedValue }) => {
    trackDocumentTransmit(hasSucceeded)
    expect(AmplitudeServiceMock.track).toHaveBeenCalledWith('Document Transmitted', {
      document_transmission: expectedValue,
    })
  })
})

describe('document search tracking', () => {
  it('tracks document search value', () => {
    const searchValue = 'A search value'
    trackDocumentSearch(searchValue)

    expect(AmplitudeServiceMock.track).toHaveBeenCalledWith('Document Searched', {
      document_search: searchValue,
    })
  })
})

describe('trackDocumentConsulted', () => {
  const tests: {
    gedContext: GedContext
    expectedLocalisation: string
  }[] = [{
    gedContext: GedContext.ACCOUNTING,
    expectedLocalisation: DocumentConsultationSource.ARCHIVES,
  }, {
    gedContext: GedContext.LEGACY,
    expectedLocalisation: DocumentConsultationSource.GED,
  }, {
    gedContext: GedContext.SOCIAL_MANAGEMENT,
    expectedLocalisation: DocumentConsultationSource.GED,
  }]
  it.each(tests)('$description', ({
    gedContext,
    expectedLocalisation,
  }) => {
    trackDocumentConsulted(gedContext)

    expect(AmplitudeServiceMock.track).toHaveBeenCalledWith('Document Consulted', {
      document_consultation_localisation: expectedLocalisation,
    })
  })
})
