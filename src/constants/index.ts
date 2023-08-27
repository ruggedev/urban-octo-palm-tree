import { Abi } from 'viem'
import { UniswapV2Like, Token, TPayload, Address, Pair } from '../types'
import { readFile } from '../utils/file'
import { chunkCalls } from '../utils/multicall'
import { viemClient } from '../network'
import { getExchange, sortTokens } from '../utils'
import ERC20Abi from '../abis/ERC20.json'
import FactoryABI from '../abis/IUniswapV2Factory.json'
import { ethers } from 'ethers'
import { massUpdatePrice, massUpdateReserve } from '../utils/updater'

export async function getAllUniswapInstance(): Promise<
  UniswapV2Like[] | undefined
> {
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
    const newToken = new Token(
      names[i].res,
      tokenAddress,
      symbols[i].res,
      decimals[i].res,
    )
    if (newToken) {
      tokens.push(newToken)
    } else console.log('failed to create new token')
  })

  // get price when init tokens
  await massUpdatePrice(tokens)

  return tokens
}

export async function getAllUniPairs(
  unis: UniswapV2Like[],
  tokens: Token[],
): Promise<Pair[] | undefined> {
  if (!unis || unis.length == 0) {
    console.log('Invalid unis')
    return
  }
  if (!tokens || tokens.length == 0) {
    console.log('Invalid tokens')
    return
  }

  const pairList: Token[][] = []

  // simple O(n^2) loops to get a list of unique pairs
  for (let i = 0; i < tokens.length; i++) {
    for (let j = 0; j < tokens.length; j++) {
      if (i == j) continue
      const [token0, token1] = sortTokens(tokens[i], tokens[j])
      pairList.push([token0, token1])
    }
  }

  // multicall payloads for each pair
  const pairCalls: any[] = []

  // try `getPair` from each UniswapFactory for each pair
  pairList.map((pair) => {
    for (const uni of unis) {
      pairCalls.push({
        address: uni.factoryAddress as Address,
        abi: FactoryABI as Abi,
        functionName: 'getPair',
        args: [pair[0].address, pair[1].address],
      })
    }
  })

  const pairRes = await chunkCalls(viemClient, pairCalls)
  if (!pairRes) return

  const pairs: Pair[] = []
  pairRes.map((r, i) => {
    if (
      pairList[i] &&
      r &&
      r.res != ethers.constants.AddressZero &&
      r.address
    ) {
      const found = pairs.find((pair) => {
        return pair.address === r.res
      })
      if (!found) {
        const tokens0 = tokens.find((token) => {
          return token.address === r.args![0]
        })
        const tokens1 = tokens.find((token) => {
          return token.address === r.args![1]
        })
        if (!tokens0 || !tokens1) return
        const uni = getExchange(r.address, unis)

        if (!uni) {
          console.error('Exchange not found ')
        } else {
          const newPair = new Pair(tokens0, tokens1, r.res, uni)
          if (newPair) pairs.push(newPair)
          else console.log('failed to create new token')
        }
      }
    }
  })
  await massUpdateReserve(pairs)
  return pairs
}
