export function getRandomInt(min: number, max: number): number {
  const minValue = Math.ceil(min)
  const maxValue = Math.floor(max)
  return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue
}

export function createGradient(color: string[]): CanvasGradient | string {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 2, 200)
    gradient.addColorStop(0, `rgba(${color[0]}, 0.18)`)
    gradient.addColorStop(1, `rgba(${color[1]}, 0)`)
    return gradient
  }
  return color[0]
}
