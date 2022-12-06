/* eslint-disable @typescript-eslint/restrict-plus-operands */
export const formatTime = (date: Date): string => {
  const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
  const d = new Date(date)
  const month = months[d.getMonth()]
  const number = d.getDate()
  const hr = d.getHours()
  let min = String(d.getMinutes())
  if (+min < 10) {
    min = '0' + min
  }
  return `${hr}:${min} ${number} ${month}`
}
