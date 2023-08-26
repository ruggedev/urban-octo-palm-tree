import { UniswapV2Like } from "../types";
import { readFile } from "../utils/file";

export async function getAllUniswap(): Promise<UniswapV2Like[] | undefined> {
  const uniV2Json = await readFile("src/constants/uniswapv2.json");

  if (!uniV2Json) {
    console.error("Invalid JSON");
    return undefined;
  }

  let listOfV2: UniswapV2Like[] = [];
  const parsedJson = JSON.parse(uniV2Json);

  for (const i of parsedJson) {
    let uniV2 = new UniswapV2Like(
      i["name"],
      i["router"],
      i["factory"],
      i["fee"]
    );
    listOfV2.push(uniV2);
  }

  return listOfV2;
}
