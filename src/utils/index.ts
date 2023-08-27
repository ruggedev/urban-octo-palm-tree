import { ethers } from 'ethers'
import { Address, Token, UniswapV2Like } from '../types'

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

export const sortTokens = (tokenA: Token, tokenB: Token) => {
  if (
    ethers.BigNumber.from(tokenA.address).lt(
      ethers.BigNumber.from(tokenB.address),
    )
  ) {
    return [tokenA, tokenB]
  }
  return [tokenB, tokenA]
}

// get UniswapV2Like obj by it's factoryAddress
export function getExchange(
  factoryAddress: Address,
  exchanges: UniswapV2Like[],
): UniswapV2Like | undefined {
  return exchanges.find((obj) => {
    return (
      obj.factoryAddress.toLowerCase() == factoryAddress.toLowerCase() ??
      undefined
    )
  })
}

// check if obj inside the obj arr
export function checkArray<T>(array: T[][], element: T[]): boolean {
  return JSON.stringify(array).indexOf(JSON.stringify(element)) !== -1
}
