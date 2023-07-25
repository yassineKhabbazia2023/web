export const imageResolver = (type: string, name: string) => {
  const baseURl = import.meta.env.VITE_CDN_URL
  return new URL(`${type}/${name}.svg`, baseURl).href
}
