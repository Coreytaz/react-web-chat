export function getCookie(name: string): string | undefined {
  const value = document.cookie
    .split('; ')
    .find((c) => c.startsWith(encodeURIComponent(name) + '='))
  return value ? decodeURIComponent(value.slice(value.indexOf('=') + 1)) : undefined
}
export function setCookie(name: string, value: string): void {
  document.cookie =
    encodeURIComponent(name) + '=' + encodeURIComponent(value) + '; Path=/; SameSite=Lax'
}
export function delСookie(name: string): void {
  document.cookie = encodeURIComponent(name) + '=; Path=/; Max-Age=0; SameSite=Lax'
}
