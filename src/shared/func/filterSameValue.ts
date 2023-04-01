import { objectKeys } from '@libeilong/func'

export function filterSameValue<T extends object>(source: T, target: T): T {
  const result = { ...target }
  for (const key of objectKeys(target)) {
    if (result[key] === source[key]) {
      delete result[key]
    }
  }
  return result
}

