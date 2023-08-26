import { PublicClient, Address } from 'viem'
import { TPayload, multicallResponse } from '../types'
import { chunkifyArray } from '.'
const MULTICALL_SIZE = 500

export async function multiCallHelper(
  multicallClient: PublicClient,
  payloads: TPayload[],
): Promise<multicallResponse[] | undefined> {
  // flatten payloads into array
  const calls = payloads
    .map((payload) => {
      return [
        {
          abi: payload.abi,
          address: payload.address as Address,
          functionName: payload.functionName,
          args: payload.args ? payload.args : [],
        } as const,
      ]
    })
    .flat()

  const result = await multicallClient.multicall({
    contracts: calls,
    allowFailure: false,
    batchSize: 0,
  })

  const resultDict: multicallResponse[] = []
  payloads.map((payload, i) => {
    {
      resultDict.push({ res: result[i], ...payload })
    }
  })

  return resultDict
}

// wrapper of multiCallHelper
export async function chunkCalls(
  multicallClient: PublicClient,
  payloads: TPayload[],
): Promise<multicallResponse[] | undefined> {
  const chunksPaylod: TPayload[][] = chunkifyArray<TPayload>(
    payloads,
    MULTICALL_SIZE,
  )
  let ans: multicallResponse[] = []
  const promises: any[] = []
  for (const chunk of chunksPaylod) {
    promises.push(await multiCallHelper(multicallClient, chunk))
  }

  const r = await Promise.all(promises)
  ans = r.filter((f) => f.res == undefined)
  return ans.flat()
}
