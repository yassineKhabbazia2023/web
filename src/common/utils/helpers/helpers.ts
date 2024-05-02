/**
 * Function that constructs the full name using 'firstName' and 'lastName' as parameters
 * @param {string, string}
 * @returns {string}
 */

export const getFullName = (
  firstName: string | undefined,
  lastName: string | undefined,
  lastNameToUpper: boolean = false,
) => {
  const fullName = `${firstName ?? ''} ${lastName ?? ''}`.trim()
  return lastNameToUpper && lastName
    ? `${firstName ?? ''} ${lastName.toUpperCase()}`.trim()
    : fullName
}
