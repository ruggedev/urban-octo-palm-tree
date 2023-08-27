import { ethers } from 'ethers'
import { Pair, Token } from '../types'

export function printAllTokens(tokens: Token[]): void {
  const msg = []
  for (const token of tokens) {
    msg.push({
      name: `${token.name}`,
      symbol: `${token.symbol}`,
      decimal: `${token.decimals}`,
      address: `${token.address}`,
      price: `${token.tokenPrice}`,
    })
  }

  console.table(msg)
}

export function printAllPairs(pairs: Pair[]): void {
  const msg = []
  for (const pair of pairs) {
    msg.push({
      token0: `${pair.token0.symbol} ($ ${pair.token0.tokenPrice})`,
      token1: `${pair.token1.symbol} ($ ${pair.token1.tokenPrice})`,
      exchange: `${pair.exchange.name}`,
      r0: `${ethers.utils.formatUnits(pair.reserve0, pair.token0.decimals)}`,
      r0USD: `${pair.reserve0USD}`,
      r1: `${ethers.utils.formatUnits(pair.reserve1, pair.token1.decimals)}`,
      r1USD: `${pair.reserve1USD}`,
    })
  }

  console.table(msg)
}
