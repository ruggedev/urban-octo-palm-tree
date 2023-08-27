import { getAllUniswapInstance } from './constants'
import { wssProvider } from './network'
import { UniswapV2Like } from './types'
import logger from './utils/logger'
import { parseRouterTx } from './utils/parse'

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
  logger.debug(`New transaction found from mempool: ${txHash}`)

  // parse transaction and get related tokens
  const parsedTx = parseRouterTx(tx)

  console.log(parsedTx)
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

  wssProvider.on('pending', async (txHash: any) =>
    filterTransaction(txHash, unis),
  )
}

main()
