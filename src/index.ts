import { getWssProvider } from "./network";
const filterRouterTx = async (txHash: any) => {
  console.log(`New transaction found from mempool: ${txHash}`);
};

function main() {
  const wssProvider = getWssProvider();
  if (!wssProvider) {
    console.error("WSS provider not found.");
    process.exit(1);
  }

  wssProvider.on("pending", async (txHash) => filterRouterTx(txHash));
}

main();
