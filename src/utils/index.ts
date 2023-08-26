// Split array into multiple chunks
export function chunkifyArray<T>(array: T[], chunkSize: number): T[][] {
  const chunkedArray: any[][] = []

  let index = 0

  while (index < array.length) {
    chunkedArray.push(array.slice(index, index + chunkSize))

    index += chunkSize
  }

  return chunkedArray
}
