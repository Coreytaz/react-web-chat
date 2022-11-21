/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-useless-escape */
export function getCookie (name: string): string | undefined {
  const matches = document.cookie.match(new RegExp(
    '(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
  ))
  return (matches != null) ? decodeURIComponent(matches[1]) : undefined
}

export function delСookie (name: string): void {
  setCookie(name, '', {
    'max-age': -1
  })
}

export function setCookie (name: string, value: string, options: any = {}): void {
  options = {
    path: '/',
    ...options
  }

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString()
  }

  let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value)

  for (const optionKey in options) {
    updatedCookie += '; ' + optionKey
    const optionValue = options[optionKey]
    if (optionValue !== true) {
      updatedCookie += '=' + optionValue
    }
  }

  document.cookie = updatedCookie
}
