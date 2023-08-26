import { Contract } from 'ethers'
import RouterAbi from '../abis/IUniswapV2Router02.json'
import FactoryAbi from '../abis/IUniswapV2Factory.json'
import { jsonProvider } from '../network'

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
