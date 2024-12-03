import { describe } from "vitest";
import { amplitudeTrackSpy } from '@ged/../vitest.setup'
import { trackDepositedDocument, trackDocumentDelete, trackDocumentDeleteFlowStart, trackDocumentDownload, trackDocumentDownloadFlowStart, trackDocumentMove, trackDocumentMoveFlowStart, trackDocumentRename, trackDocumentRenameFlowStart, trackDocumentSearch, trackDocumentTransmit, trackDocumentTransmitFlowStart } from '@ged/services/tracking/tracking.service'
import { TriggerSource } from "./tracking.types"

const successValue = 'succeeded'
const failValue = 'failed'

describe('document deposit tracking', () => {
  it('tracks the deposit of documents', () => {
    const payload = {
      serviceName: 'a cool service name',
      depositedDocumentsCount: 10,
      successfulDepositsCount: 8,
      failedDepositsCount: 2,
      destinationFolder: 'Awesome Folder',
    }
    trackDepositedDocument(payload)

    expect(amplitudeTrackSpy).toHaveBeenCalledWith(
      'Deposit Document Completed',
      {
        document_deposit_category: payload.serviceName,
        document_deposit_count: payload.depositedDocumentsCount,
        document_deposit_succedded: payload.successfulDepositsCount,
        document_deposit_failed: payload.failedDepositsCount,
        document_deposit_folder: payload.destinationFolder
      }
    )
  })
})

describe('document move tracking', () => {
  it('tracks the document move flow start and its origin', () => {
    const triggerSource = TriggerSource.ACTION_BAR
    trackDocumentMoveFlowStart(triggerSource)

    expect(amplitudeTrackSpy).toHaveBeenCalledWith('Document Moved Started', {
      document_move_start: triggerSource
    })
  })

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
    expect(amplitudeTrackSpy).toHaveBeenCalledWith('Document Moved Completed', {
      document_move_result: expectedValue
    })
  })
})

describe('document rename tracking', () => {
  it('tracks the document rename flow start and its origin', () => {
    const triggerSource = TriggerSource.ACTION_BAR
    trackDocumentRenameFlowStart(triggerSource)

    expect(amplitudeTrackSpy).toHaveBeenCalledWith('Document Rename Started', {
      document_rename_start: triggerSource
    })
  })

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
    expect(amplitudeTrackSpy).toHaveBeenCalledWith('Document Rename', {
      document_rename: expectedValue
    })
  })
})

describe('document delete tracking', () => {
  it('track the document delete flow start and its origin', () => {
    const triggerSource = TriggerSource.ACTION_BAR
    trackDocumentDeleteFlowStart(triggerSource)

    expect(amplitudeTrackSpy).toHaveBeenCalledWith('Document Delete Started', {
      document_delete_start: triggerSource
    })
  })

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
    expect(amplitudeTrackSpy).toHaveBeenCalledWith('Document Delete', {
      document_delete: expectedValue
    })
  })
})

describe('document download tracking', () => {
  it('track the document download flow start and its origin', () => {
    const triggerSource = TriggerSource.ACTION_BAR
    trackDocumentDownloadFlowStart(triggerSource)

    expect(amplitudeTrackSpy).toHaveBeenCalledWith('Document Download Started', {
      document_download_start: triggerSource
    })
  })

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
    expect(amplitudeTrackSpy).toHaveBeenCalledWith('Document Download', {
      document_download: expectedValue
    })
  })
})

describe('document transmit tracking', () => {
  it('track the document transmit flow start and its origin', () => {
    const triggerSource = TriggerSource.ACTION_BAR
    trackDocumentTransmitFlowStart(triggerSource)

    expect(amplitudeTrackSpy).toHaveBeenCalledWith('Document Transmit Started', {
      document_transmit_start: triggerSource
    })
  })

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
    expect(amplitudeTrackSpy).toHaveBeenCalledWith('Document Transmitted', {
      document_transmission: expectedValue
    })
  })
})

describe('document search tracking', () => {
  it('tracks document search value',  () => {
    const searchValue = 'A search value'
    trackDocumentSearch(searchValue)

    expect(amplitudeTrackSpy).toHaveBeenCalledWith('Document Searched', {
      document_search: searchValue
    })
  })
})
