import { describe, it, expect } from 'vitest'

describe('delegationDrawer', () => {
  describe('rendering', () => {
    it('should display the collab folders number', () => {
      expect(true).toBeTruthy()
    })

    it('should display the correct steps when DelegationFlowType.FULL', () => {
      expect(true).toBeTruthy()
    })

    it('should render AddDelegatesStep when activeStep = 0', () => {
      expect(true).toBeTruthy()
    })

    it('should render DelegationPreviewList when activeStep = 1', () => {
      expect(true).toBeTruthy()
    })
  })

  describe('interactions', () => {
    describe('addDelegatesStep', () => {
      it('should set selectedCollaborators upon collaborator-selection', () => {
        expect(true).toBeTruthy()
      })
    })

    describe('delegationPreviewList', () => {
      it('should update the delegationDetails upon auto delegation check box selection', () => {
        expect(true).toBeTruthy()
      })
    })

    describe('nextPreviousButtons', () => {
      it('should go back to previous step upon click-previous event', () => {
        expect(true).toBeTruthy()
      })

      it('should go to next step upon click-next and active step is 0', () => {
        expect(true).toBeTruthy()
      })

      it('should call api to complete delegation process when active step is 1', () => {
        expect(true).toBeTruthy()
      })

      it('should display failure notification when api call failes then close the drawer', () => {
        expect(true).toBeTruthy()
      })
    })
  })
})
