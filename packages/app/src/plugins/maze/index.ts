export default function maze(m: any, a: any, z: any, e: any) {
  let t
  try {
    t = m.sessionStorage.getItem('maze-us')
  } catch (err) {}

  if (!t) {
    t = new Date().getTime()
    try {
      m.sessionStorage.setItem('maze-us', t)
    } catch (err) {}
  }

  const s = a.createElement('script')
  s.src = `${z}?apiKey=${e}`
  s.async = true
  a.getElementsByTagName('head')[0].appendChild(s)
  m.mazeUniversalSnippetApiKey = e
}
