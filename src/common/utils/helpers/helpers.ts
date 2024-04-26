/**
 * Function that constructs the full name using 'firstName' and 'lastName' as parameters
 * @param {string, string}
 * @returns {string}
 */

export const getFullName = ({ firstName, lastName }: { firstName: string, lastName: string }) => {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`
  }
}
