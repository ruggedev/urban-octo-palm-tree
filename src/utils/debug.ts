import { getExchange } from '.'
import { Pair, Token } from '../types'

export function printAllTokens(tokens: Token[]): void {
  const msg = []
  for (const token of tokens) {
    msg.push({
      name: `${token.name}`,
      symbol: `${token.symbol}`,
      decimal: `${token.decimals}`,
    })
  }

  console.table(msg)
}

export function printAllPairs(pairs: Pair[]): void {
  const msg = []
  for (const pair of pairs) {
    msg.push({
      token0: `${pair.token0.symbol}`,
      token1: `${pair.token1.symbol}`,
      exchange: `${pair.exchange.name}`,
      r0: `${pair.reserve0}`,
      r1: `${pair.reserve1}`,
    })
  }

  console.table(msg)
}
