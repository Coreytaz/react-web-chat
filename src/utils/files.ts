export const MAX_ATTACHMENTS = 9
export function isImage(file: File): boolean {
  return (
    /\.(jpe?g|png)$/i.test(file.name) &&
    (!file.type || ['image/jpeg', 'image/png'].includes(file.type))
  )
}
