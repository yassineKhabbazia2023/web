'use strict'

export const dateFormatter = (date: string) => new Intl.DateTimeFormat('fr').format(new Date(date))
