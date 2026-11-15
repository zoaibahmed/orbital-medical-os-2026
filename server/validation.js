export class InputError extends Error {}
export function object(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new InputError('A JSON object is required')
  return value
}
export function number(value, label, min, max, integer = false) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))) throw new InputError(`${label} must be ${integer ? 'an integer' : 'a number'} between ${min} and ${max}`)
  return value
}
export function text(value, label, max = 1000) {
  if (typeof value !== 'string' || value.length > max) throw new InputError(`${label} must be text of at most ${max} characters`)
  return value
}
export function oneOf(value, values, label) {
  if (!values.includes(value)) throw new InputError(`Invalid ${label}`)
  return value
}
export function boolean(value, label) {
  if (typeof value !== 'boolean') throw new InputError(`${label} must be true or false`)
  return value
}
export function date(value, label) {
  const result = text(value, label, 40)
  if (!Number.isFinite(Date.parse(result))) throw new InputError(`${label} must be a valid date`)
  return result
}
