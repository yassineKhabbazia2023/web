
export const handleRequestError = (action: string, error: any) => {
  console.error(`Error ${action}:`, error)
}
export const getInitials = (firstName: string|undefined, lastName: string|undefined) => {
  const firstInitial = firstName?.at(0)?.toUpperCase() ?? ''
  const secondInitial = lastName?.at(0)?.toUpperCase() ?? ''
  return `${firstInitial}${secondInitial}`
}
