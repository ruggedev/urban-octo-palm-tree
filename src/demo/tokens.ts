import { getAllTokens } from '../constants'
import { printAllTokens } from '../utils/debug'

async function tokensDemo() {
  const tokens = await getAllTokens()

  if (!tokens) {
    console.error('Tokens not found')
    process.exit(1)
  }

  printAllTokens(tokens)

  process.exit(0)
}

tokensDemo()
