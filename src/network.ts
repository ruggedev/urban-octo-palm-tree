import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

export function getWssProvider() {
  try {
    return new ethers.WebSocketProvider(process.env.RPC_URL_WSS!);
  } catch (e) {
    console.log(e);
  }
}
