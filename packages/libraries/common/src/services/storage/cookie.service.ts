/**
 * Service de gestion des cookies
 */
export class CookieService {
  private static escapeRegex(str: string): string {
    return str.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`)
  }

  static set(name: string, value: string, maxAgeSeconds: number = 300): void {
    document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAgeSeconds}; path=/; SameSite=Lax`
  }

  static get(name: string): string | undefined {
    const escapedName = this.escapeRegex(name)
    const match = new RegExp(`(^| )${escapedName}=([^;]+)`).exec(document.cookie)
    return match === null ? undefined : decodeURIComponent(match[2])
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
