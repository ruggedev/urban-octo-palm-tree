import { ethers } from 'ethers'
import * as dotenv from 'dotenv'
dotenv.config()

export const wssProvider =
  new ethers.WebSocketProvider(process.env.RPC_URL_WSS!) ?? undefined

export const jsonProvider = new ethers.JsonRpcProvider(process.env.RPC_URL)
