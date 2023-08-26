import { Pair } from '../types'
import PairABI from '../abis/IUniswapV2Pair.json'
import { Abi } from 'viem'
import { multiCallHelper } from './multicall'
import { BigNumber } from 'ethers'
import { viemClient } from '../network'

export async function massUpdateReserve(pairs: Pair[]) {
  // update reserves
  const updatePairCall: any[] = []
  pairs.map((pair) => {
    updatePairCall.push({
      address: pair.address,
      abi: PairABI as Abi,
      functionName: 'getReserves',
    })
  })

  const updatePairRes = await multiCallHelper(viemClient, updatePairCall)
  if (!updatePairRes) return
  updatePairRes.forEach(async (r, i) => {
    await pairs[i].updateReserves(
      BigNumber.from(r.res[0]),
      BigNumber.from(r.res[1]),
      r.res[2],
    )
  })
}
