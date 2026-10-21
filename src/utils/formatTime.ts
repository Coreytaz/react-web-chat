export const formatTime = (date: string): string => {
  const value = new Date(date)
  if (!Number.isFinite(value.getTime())) return ''
  return (
    value.getHours() +
    ':' +
    String(value.getMinutes()).padStart(2, '0') +
    ' ' +
    value.getDate() +
    ' ' +
    [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь'
    ][value.getMonth()]
  )
}
