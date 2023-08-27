export async function fetchCurrentTokenPrice(
  chainSlug: string,
  contractAddress: string,
): Promise<number | undefined> {
  try {
    const id = `${chainSlug}:${contractAddress}`
    const response = await fetch(
      `https://coins.llama.fi/prices/current/${id}?searchWidth=4h`,
    )
    if (response && response.ok) {
      const json = await response.json()
      if (json['coins'][id]['price']) return Number(json['coins'][id]['price'])
      else return undefined
    } else {
      return undefined
    }
  } catch {
    return undefined
  }
}
