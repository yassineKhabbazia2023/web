import type {
  NotificationDomainSettings,
  NotificationSettingsConfiguration,
  NotificationSetting,
} from '@app/modules/FeedCenter/types/notification.type'

export function getNotificationSettingsConfiguration(): NotificationSettingsConfiguration {
  return {
    domainSettings: getMultipleDomainNotificationSettings(),
    preferenceSettings: {
      hasOnlyFavouritesDisplayed: false,
    },
  }
}

export function getNotificationSettingsConfigurationWithFavourites(): NotificationSettingsConfiguration {
  return {
    domainSettings: getMultipleDomainNotificationSettings(),
    preferenceSettings: {
      hasOnlyFavouritesDisplayed: true,
    },
  }
}

export function getEmptyNotificationSettingsConfiguration(): NotificationSettingsConfiguration {
  return {
    domainSettings: [],
    preferenceSettings: {
      hasOnlyFavouritesDisplayed: false,
    },
  }
}

export function getSingleDomainNotificationSettingsConfiguration(): NotificationSettingsConfiguration {
  return {
    domainSettings: [getDomainNotificationSettingsWithTrueAndFalse()],
    preferenceSettings: {
      hasOnlyFavouritesDisplayed: false,
    },
  }
}

export function getNotificationSettingsWithTrueAndNull(): NotificationSetting[] {
  return [
    { id: 1, label: 'Setting 1', feedcenterValue: true, emailValue: true },
    { id: 2, label: 'Setting 2', feedcenterValue: null, emailValue: null },
    { id: 3, label: 'Setting 3', feedcenterValue: true, emailValue: null },
  ]
}

export function getNotificationSettingsWithTrueAndFalse(): NotificationSetting[] {
  return [
    { id: 1, label: 'Setting 1', feedcenterValue: true, emailValue: true },
    { id: 2, label: 'Setting 2', feedcenterValue: false, emailValue: true },
  ]
}

export function getNotificationSettingsWithTrueFalseAndNull(): NotificationSetting[] {
  return [
    { id: 1, label: 'Setting 1', feedcenterValue: true, emailValue: true },
    { id: 2, label: 'Setting 2', feedcenterValue: false, emailValue: true },
    { id: 3, label: 'Setting 3', feedcenterValue: false, emailValue: null },
  ]
}

export function getDomainNotificationSettingsWithTrueAndNull(): NotificationDomainSettings {
  return {
    domain: 'test-domain',
    settings: getNotificationSettingsWithTrueAndNull(),
  }
}

export function getDomainNotificationSettingsWithTrueAndFalse(): NotificationDomainSettings {
  return {
    domain: 'test-domain',
    settings: getNotificationSettingsWithTrueAndFalse(),
  }
}

export function getDomainNotificationSettingsWithTrueFalseAndNull(): NotificationDomainSettings {
  return {
    domain: 'test-domain',
    settings: getNotificationSettingsWithTrueFalseAndNull(),
  }
}

export function getDomainNotificationSettingsAfterEnableAll(): NotificationDomainSettings {
  return {
    domain: 'test-domain',
    settings: [
      { id: 1, label: 'Setting 1', feedcenterValue: true, emailValue: true },
      { id: 2, label: 'Setting 2', feedcenterValue: true, emailValue: true },
    ],
  }
}

export function getDomainNotificationSettingsAfterDisableAll(): NotificationDomainSettings {
  return {
    domain: 'test-domain',
    settings: [
      { id: 1, label: 'Setting 1', feedcenterValue: false, emailValue: false },
      { id: 2, label: 'Setting 2', feedcenterValue: false, emailValue: false },
    ],
  }
}

export function getDomainNotificationSettingsAfterEnableAllWithNulls(): NotificationDomainSettings {
  return {
    domain: 'test-domain',
    settings: [
      { id: 1, label: 'Setting 1', feedcenterValue: true, emailValue: true },
      { id: 2, label: 'Setting 2', feedcenterValue: true, emailValue: true },
      { id: 3, label: 'Setting 3', feedcenterValue: true, emailValue: null },
    ],
  }
}

export function getNotificationSettingsWithFalseAndNull(): NotificationSetting[] {
  return [
    { id: 1, label: 'Setting 1', feedcenterValue: false, emailValue: false },
    { id: 2, label: 'Setting 2', feedcenterValue: null, emailValue: null },
    { id: 3, label: 'Setting 3', feedcenterValue: false, emailValue: null },
  ]
}

export function getMultipleDomainNotificationSettings(): NotificationDomainSettings[] {
  return [
    {
      domain: 'Domain1',
      settings: [
        { id: 1, label: 'Setting 1', feedcenterValue: true, emailValue: false },
        { id: 2, label: 'Setting 2', feedcenterValue: null, emailValue: true },
      ],
    },
    {
      domain: 'Domain2',
      settings: [
        { id: 3, label: 'Setting 3', feedcenterValue: false, emailValue: null },
      ],
    },
  ]
}

export function getEmptyDomainNotificationSettings(): NotificationDomainSettings[] {
  return [
    {
      domain: 'EmptyDomain',
      settings: [],
    },
  ]
}
