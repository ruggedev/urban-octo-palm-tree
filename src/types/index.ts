import { Contract, ethers } from 'ethers'
import RouterAbi from '../abis/IUniswapV2Router02.json'
import FactoryAbi from '../abis/IUniswapV2Factory.json'
import ERC20Abi from '../abis/ERC20.json'
import { jsonProvider } from '../network'
import { Abi } from 'viem'

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

  factory: string
  factoryContract: Contract

  fee: number

  constructor(_name: string, _router: string, _factory: string, _fee: number) {
    this.name = _name
    this.routerAddress = _router
    this.routerInstance = new Contract(_router, RouterAbi, jsonProvider)
    this.factory = _factory
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
}
