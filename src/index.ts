import {
  getAllTokens,
  getAllUniPairs,
  getAllUniswapInstance,
} from './constants'
import { wssProvider } from './network'
import { UniswapV2Like } from './types'
import { printAllPairs, printAllTokens } from './utils/debug'

const filterTransaction = async (
  txHash: string,
  uniswapV2s: UniswapV2Like[],
) => {
  const uniRouterAddresses = uniswapV2s.map(
    (uni: UniswapV2Like) => uni.routerAddress,
  )

  const tx = await wssProvider.getTransaction(txHash)

  // only get transaction related to those UniswapV2Router
  if (tx === null || !tx.to || !uniRouterAddresses.includes(tx.to)) return

  console.log(`New transaction found from mempool: ${txHash}`)
}

async function main() {
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
  //   wssProvider.on('pending', async (txHash: any) =>
  //     filterTransaction(txHash, unis),
  //   )
}

main()
