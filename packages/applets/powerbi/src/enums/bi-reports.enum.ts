export enum ReportStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  FAILED = 'FAILED',
  PENDING_VALIDATION = 'PENDING_VALIDATION',
}

export enum ReportTypeEnum {
  LOOP = 'loop',
  SILAE = 'silae',
  FORMS = 'forms',
  PAYFIT = 'payfit',
  PENNYLANE = 'pennylane',
  RH = 'rh',
  ESC = 'esc',
  AUT = 'aut',
  UNKNOWN = 'unknown',
}

export enum ReportTypeLabelEnum {
  LOOP = 'Loop',
  SILAE = 'Silae',
  FORMS = 'Forms',
  PAYFIT = 'Payfit',
  PENNYLANE = 'Pennylane',
  RH = 'RH',
  ESC = 'ESC',
  AUT = 'AUT',
  UNKNOWN = 'Inconnu',
}

export enum ReportDeleteOption {
  ALL = 'all', // Platform + Power BI Workspace
  PLATFORM_ONLY = 'platformOnly', // Platform only
}
