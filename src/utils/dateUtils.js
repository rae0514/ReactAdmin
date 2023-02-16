export function getDate(time) {
    const date = new Date(time)
    const year = date.getFullYear() + '-'
    const month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    const day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
    const hour = date.getHours() + ':'
    const minute = date.getMinutes() + ':'
    const second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return year+month+day+hour+minute+second
}