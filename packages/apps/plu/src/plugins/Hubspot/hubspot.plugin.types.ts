export interface InitHubspotParams {
  onHubspotClose: () => void,
}

export interface HubSpotState {
  isActive: boolean
  isInitialized: boolean
}

export interface InstallHubSpotParams {
  isActive: boolean,
}
