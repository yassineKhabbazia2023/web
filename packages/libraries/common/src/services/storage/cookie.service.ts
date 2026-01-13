/**
 * Service de gestion des cookies
 */
export class CookieService {
  private static escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  static set(name: string, value: string, maxAgeSeconds: number = 300): void {
    document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAgeSeconds}; path=/; SameSite=Lax`
  }

  static get(name: string): string | undefined {
    const escapedName = this.escapeRegex(name)
    const match = document.cookie.match(new RegExp(`(^| )${escapedName}=([^;]+)`))
    return match !== null ? decodeURIComponent(match[2]) : undefined
  }

  static remove(name: string): void {
    document.cookie = `${name}=; max-age=0; path=/`
  }

  static consume(name: string): string | undefined {
    const value = this.get(name)
    if (value !== undefined) {
      this.remove(name)
    }
    return value
  }
}
