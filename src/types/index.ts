import { BigNumber, Contract, ethers } from 'ethers'
import RouterAbi from '../abis/IUniswapV2Router02.json'
import FactoryAbi from '../abis/IUniswapV2Factory.json'
import ERC20Abi from '../abis/ERC20.json'
import { jsonProvider } from '../network'
import { Abi } from 'viem'
import { fetchCurrentTokenPrice } from '../utils/price'

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
    console.log(`New UniswapV2Like ${_name} added`)
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
    console.debug(`New token created: ${_name}`)
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
  reserve0USD: BigNumber = BigNumber.from(0)
  reserve1: BigNumber = BigNumber.from(0)
  reserve1USD: BigNumber = BigNumber.from(0)
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
  }

  public async updateReserves(
    r0: BigNumber,
    r1: BigNumber,
    t: number,
    updatePrice: boolean = false,
  ) {
    this.reserve0 = r0
    this.reserve1 = r1
    this.lastUpdateTimestamp = t

    if (updatePrice) {
      await this.token0.updatePrice()
      await this.token1.updatePrice()
      this.reserve0USD = this.reserve0.mul(this.token0.tokenPrice)
      this.reserve1USD = this.reserve1.mul(this.token1.tokenPrice)
    }
  }
}
