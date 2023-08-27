import { ethers } from 'ethers'
import RouterAbi from '../abis/IUniswapV2Router02.json'
import { ParsedSwapTokensForTokens } from '../types'

const routerInterface = new ethers.utils.Interface(RouterAbi)

export const parseRouterTx = (tx: any): ParsedSwapTokensForTokens => {
  const txInfo = routerInterface.parseTransaction({ data: tx.data })

  const parsedTx: ParsedSwapTokensForTokens = {
    path: txInfo.args['path'],
    amountIn: txInfo.args['amountIn'],
    amountOutMin: txInfo.args['amountOutMin'],
    deadline: txInfo.args['deadline'],
    to: txInfo.args['to'],
  }

  return parsedTx
}
