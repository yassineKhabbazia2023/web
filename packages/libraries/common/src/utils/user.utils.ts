/**
 * Function to get initials
 * @param {string} firstName
 * @param {string} lastName
 * @returns {string}
 */
export const getInitials = (firstName: string | undefined, lastName: string | undefined) => {
  const firstInitial = firstName?.at(0)?.toUpperCase() ?? ''
  const secondInitial = lastName?.at(0)?.toUpperCase() ?? ''

  return `${firstInitial}${secondInitial}`
}

/**
 * Function that constructs the full name using 'firstName' and 'lastName' as parameters
 * @param {string} firstName - The first name
 * @param {string} lastName - The last name
 * @returns {string} The full name in normal case
 */
export const getFullName = (
  firstName: string | undefined,
  lastName: string | undefined,
) => {
  return `${firstName ?? ''} ${lastName ?? ''}`.trim()
}

/**
 * Function that constructs the full name with last name in uppercase
 * @param {string} firstName - The first name
 * @param {string} lastName - The last name
 * @returns {string} The full name with uppercase last name
 */
export const getFullNameWithUppercaseLastName = (
  firstName: string | undefined,
  lastName: string | undefined,
) => {
  return lastName
    ? `${firstName ?? ''} ${lastName.toUpperCase()}`.trim()
    : `${firstName ?? ''}`.trim()
}
