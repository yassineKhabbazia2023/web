// Monday=1 to Sunday=7 maps directly to index+1 in the grid rows
export const DAY_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'] as const

export const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'] as const

export const toDateKey = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export const toUtcDays = (date: Date): number => {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / (1000 * 60 * 60 * 24)
}

export const formatDate = (date: Date): string => {
  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`
}

export const formatCommitDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const getColorLevel = (count: number): number => {
  if (count === 0) {
    return 0
  }
  if (count <= 2) {
    return 1
  }
  if (count <= 5) {
    return 2
  }
  if (count <= 9) {
    return 3
  }
  return 4
}

export const isMergePullRequest = (comment: string): boolean => {
  return /^Merge pull request/i.test(comment)
}
