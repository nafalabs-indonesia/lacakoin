// src/lib/wagmi.ts
import { http, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http("https://cloudflare-eth.com"),
    [sepolia.id]: http("https://rpc.sepolia.org"),
  },
});