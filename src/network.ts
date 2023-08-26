import { ethers } from 'ethers'
import { createPublicClient, http, PublicClient, Address } from 'viem'
import { polygon } from 'viem/chains'
import * as dotenv from 'dotenv'
dotenv.config()

export const wssProvider =
  new ethers.providers.WebSocketProvider(process.env.RPC_URL_WSS!) ?? undefined

export const jsonProvider = new ethers.providers.JsonRpcProvider(
  process.env.RPC_URL,
)

export const viemClient = createPublicClient({
  chain: polygon,
  transport: http(process.env.RPC_URL),
})
