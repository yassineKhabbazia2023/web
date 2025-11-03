import { logger } from '@pulse/toolbox'
import { BookingConfigurationFormData } from '../booking.type'

declare let window: {
  EnvVars: any
} & Window

function getConfigurationLinkRegExp() {
  try {
    const regExp = window.EnvVars?.VITE_BOOKING_LINK_PATTERN
      ? new RegExp(window.EnvVars?.VITE_BOOKING_LINK_PATTERN)
      : undefined

    return regExp
  } catch (error) {
    logger.trace('error while parsing VITE_BOOKING_LINK_PATTERN', error)
  }
}

export function getConfigurationLinkErrorMessage({
  configurationLink,
  requiredErrorMessage,
  wrongFormatErrorMessage,
}: {
  configurationLink: string
  requiredErrorMessage: string
  wrongFormatErrorMessage: string
}) {
  if (configurationLink === '') {
    return requiredErrorMessage
  }
  const regExp = getConfigurationLinkRegExp()
  if (regExp?.test(configurationLink) === false) {
    return wrongFormatErrorMessage
  }
  return '' // empty message when no error
}

export function getFormErrors({
  formData,
  requiredErrorMessage,
  wrongFormatErrorMessage,
}: {
  formData: BookingConfigurationFormData
  requiredErrorMessage: string
  wrongFormatErrorMessage: string
}): BookingConfigurationFormData {
  const bookingConfigurationForm: BookingConfigurationFormData = {
    configurationLink: getConfigurationLinkErrorMessage({
      configurationLink: formData.configurationLink,
      requiredErrorMessage,
      wrongFormatErrorMessage,
    }),
  }

  return bookingConfigurationForm
}
