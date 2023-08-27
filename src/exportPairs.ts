import {
  getAllTokens,
  getAllUniPairs,
  getAllUniswapInstance,
} from './constants'
import { checkArray } from './utils'
import { writeFile } from './utils/file'

async function ExportPairs() {
  // Init
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

  // Get valid pairs
  const validPairs: string[][] = []
  pairs.map((pair) => {
    const pairSymbol = [pair.token0.symbol, pair.token1.symbol]
    if (!checkArray<string>(validPairs, pairSymbol)) {
      validPairs.push(pairSymbol)
    }
  })

  // store pairs as json
  await writeFile('src/constants/pairs.json', JSON.stringify(validPairs))

  process.exit(0)
}

ExportPairs()
