import {
  getAllTokens,
  getAllUniPairs,
  getAllUniswapInstance,
} from '../constants'
import { wssProvider } from '../network'
import { printAllPairs } from '../utils/debug'

async function pairsDemo() {
  if (!wssProvider) {
    console.error('WSS provider not found.')
    process.exit(1)
  }

  const unis = await getAllUniswapInstance()
  if (!unis) {
    console.error('UniswapV2 not found')
    process.exit(1)
  }

  const tokens = await getAllTokens()

  if (!tokens) {
    console.error('Tokens not found')
    process.exit(1)
  }

  const pairs = await getAllUniPairs(unis, tokens)
  if (!pairs) {
    console.error('Pairs not found')
    process.exit(1)
  }
  printAllPairs(pairs)

  process.exit(0)
}

pairsDemo()
