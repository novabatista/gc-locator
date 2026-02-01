
export function birthdayMaskKeyPress(e){
  if (!/[0-9]/.test(e.key)) {
    e.preventDefault()
  }
}

export function birthdayMaskChange(e){
  let value = e.target.value.replace(/\D/g, '')
  if (value.length > 0) {
    value = `${value.substring(0, 2)}/${value.substring(2, 4)}`
  }
  e.target.value = value
}