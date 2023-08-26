import { getAllTokens, getAllUniswap } from './constants'
import { wssProvider } from './network'
import { UniswapV2Like } from './types'

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

  const uniswapV2s = await getAllUniswap()
  if (!uniswapV2s) {
    console.error('UniswapV2 not found')
    process.exit(1)
  }

  const tokens = await getAllTokens()

  console.log(tokens)

  wssProvider.on('pending', async (txHash) =>
    filterTransaction(txHash, uniswapV2s),
  )
}

main()
