import { find, findIndex, some } from 'lodash'

export function dropSizeInBucket({
  mapping,
  destination,
  value
}){
  const bucket = find(mapping, (col) => col.SWSIZE_ID === destination.droppableId)
  const idx = findIndex(mapping, (col) => col.SWSIZE_ID === destination.droppableId)

  // Check if we have duplicate items in the bucket
  // lazy check, only the value and size type (25 +, 25 -, ...)
  const isDuplicate = some(bucket.VALUES, (item) => {
    return item.VALUE === value.VALUE && item.SWSIZE_TYPE === value.SWSIZE_TYPE
  })

  // No duplicates
  if(isDuplicate) {
    return mapping
  }

  const newBucket = {
    ...bucket,
    VALUES: [...bucket.VALUES, value]
  }

  const result = [ ...mapping ]
  result.splice(idx, 1, newBucket)

  return result
}