let clicks = 0
const delay = 400
let timer: any

export const manageClick = (onSingleClick: Function, onDoubleClick: Function) => {
  clicks++
  if (clicks === 1) {
    timer = setTimeout(function() {
      onSingleClick()
      clicks = 0
    }, delay)
  } else {
    clearTimeout(timer)
    onDoubleClick()
    clicks = 0
  }
}
