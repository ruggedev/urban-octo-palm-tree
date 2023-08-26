import { Abi } from 'viem'
import { UniswapV2Like, Token, TPayload, Address } from '../types'
import { readFile } from '../utils/file'
import { chunkCalls } from '../utils/multicall'
import { viemClient } from '../network'
import ERC20Abi from '../abis/ERC20.json'

export async function getAllUniswap(): Promise<UniswapV2Like[] | undefined> {
  const uniV2Json = await readFile('src/constants/uniswapv2.json')

  if (!uniV2Json) {
    console.error('Invalid JSON')
    return undefined
  }

  const listOfV2: UniswapV2Like[] = []
  const parsedJson = JSON.parse(uniV2Json)

  for (const i of parsedJson) {
    const uniV2 = new UniswapV2Like(
      i['name'],
      i['router'],
      i['factory'],
      i['fee'],
    )
    listOfV2.push(uniV2)
  }

  return listOfV2
}

export async function getAllTokens(): Promise<Token[] | undefined> {
  // parse token addresses from JSON
  const tokenJson = await readFile('src/constants/tokens.json')
  if (!tokenJson) {
    console.error('Invalid JSON')
    return undefined
  }
  const tokenAddresses: string[] = []
  JSON.parse(tokenJson).map((token: any) => {
    tokenAddresses.push(token['address'])
  })

  // store payloads for multicall
  const symbolCalls: TPayload[] = []
  const decimalCalls: TPayload[] = []
  const nameCalls: TPayload[] = []

  tokenAddresses.forEach((tokenAddress: string) => {
    symbolCalls.push({
      address: tokenAddress as Address,
      abi: ERC20Abi as Abi,
      functionName: 'symbol',
    })
    decimalCalls.push({
      address: tokenAddress as Address,
      abi: ERC20Abi as Abi,
      functionName: 'decimals',
    })
    nameCalls.push({
      address: tokenAddress as Address,
      abi: ERC20Abi as Abi,
      functionName: 'name',
    })
  })

  // fetch token info w/ multicall
  const symbols = await chunkCalls(viemClient, symbolCalls)
  const decimals = await chunkCalls(viemClient, decimalCalls)
  const names = await chunkCalls(viemClient, nameCalls)

  if (!symbols || !decimals || !names) return
  const tokens: Token[] = []
  tokenAddresses.map((tokenAddress, i) => {
    let newToken = new Token(
      names[i].res,
      tokenAddress,
      symbols[i].res,
      decimals[i].res,
    )
    if (newToken) {
      tokens.push(newToken)
    } else console.log('failed to create new token')
  })

  return tokens
}
