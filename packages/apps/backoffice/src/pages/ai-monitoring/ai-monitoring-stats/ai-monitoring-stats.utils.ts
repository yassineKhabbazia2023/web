/**
 * Format total calls as a string
 */
export function formatTotalCalls(totalCalls: number): string {
  return totalCalls.toLocaleString('fr-FR')
}

/**
 * Format total cost with euro symbol
 */
export function formatTotalCost(totalCost: number): string {
  return `${totalCost.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`
}

/**
 * Format average time in seconds
 */
export function formatAverageTime(averageTime: number): string {
  return `${averageTime.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} s`
}

/**
 * Format satisfaction rate as percentage
 */
export function formatSatisfactionRate(satisfactionRate: number): string {
  return `${Math.round(satisfactionRate)}%`
}
