import { BigNumber, Contract, ethers } from 'ethers'
import { jsonProvider } from '../network'
import { Abi } from 'viem'
import { fetchCurrentTokenPrice } from '../utils/price'
import RouterAbi from '../abis/IUniswapV2Router02.json'
import FactoryAbi from '../abis/IUniswapV2Factory.json'
import ERC20Abi from '../abis/ERC20.json'
import logger from '../utils/logger'

export type Address = `0x${string}`
export interface TPayload {
  abi: Abi
  address: Address
  functionName: string
  args?: any[]
}

export interface multicallResponse extends TPayload {
  res: any
}

export class UniswapV2Like {
  name: string
  routerAddress: string
  routerInstance: Contract

  factoryAddress: string
  factoryContract: Contract

  fee: number

  constructor(_name: string, _router: string, _factory: string, _fee: number) {
    this.name = _name
    this.routerAddress = _router
    this.routerInstance = new Contract(_router, RouterAbi, jsonProvider)
    this.factoryAddress = _factory
    this.factoryContract = new Contract(_factory, FactoryAbi, jsonProvider)
    this.fee = _fee
    logger.debug(`New UniswapV2Like ${_name} added`)
  }

  public async getPair(token0: string, token1: string): Promise<string> {
    return await this.factoryContract.getPair(token0, token1)
  }
}

export class Token {
  address: string
  symbol: string
  name: string
  decimals: number
  contract: Contract
  tokenPrice: number

  constructor(
    _name: string,
    _address: string,
    _symbol: string,
    _decimals: number,
  ) {
    this.name = _name
    this.address = _address
    this.symbol = _symbol
    this.decimals = _decimals
    this.contract = new ethers.Contract(_address, ERC20Abi, jsonProvider)
    logger.debug(`New token created: ${_name}`)
  }

  public async updatePrice(): Promise<void> {
    this.tokenPrice =
      (await fetchCurrentTokenPrice('polygon', this.address)) ?? 0
  }
}

export class Pair {
  exchange: UniswapV2Like

  address: string
  contract: Contract

  token0: Token
  token1: Token
  reserve0: BigNumber = BigNumber.from(0)
  reserve1: BigNumber = BigNumber.from(0)

  // number type, not accurate. Just for filtering small TVL pairs
  reserve0USD: number
  reserve1USD: number
  lastUpdateTimestamp: number

  constructor(
    _token0: Token,
    _token1: Token,
    _pairAddress: string,
    _exchange: UniswapV2Like,
  ) {
    if (!_token0 || !_token1 || !_pairAddress || !_exchange) {
      return
    }

    this.exchange = _exchange
    ;[this.token0, this.token1] = [_token0, _token1]
    this.address = _pairAddress
    logger.debug(
      `New token created: ${_exchange.name}: ${_token0.symbol}/${_token1.symbol}`,
    )
  }

  public async updateReserves(r0: BigNumber, r1: BigNumber, t: number) {
    this.reserve0 = r0
    this.reserve1 = r1

    this.reserve0USD =
      Number(
        ethers.utils.formatUnits(
          this.reserve0.toString(),
          this.token0.decimals,
        ),
      ) * this.token0.tokenPrice

    this.reserve1USD =
      Number(
        ethers.utils.formatUnits(
          this.reserve1.toString(),
          this.token1.decimals,
        ),
      ) * this.token1.tokenPrice
    this.lastUpdateTimestamp = t
  }
}
