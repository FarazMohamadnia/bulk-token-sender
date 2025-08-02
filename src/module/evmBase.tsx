import { mainnet, bsc, polygon } from "viem/chains";
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { writeContract } from "@wagmi/core";
import { config } from "../config/evm";

export const CHAINS = [
  {
    id: 1,
    name: "Ethereum",
    chain: mainnet,
    icon: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501625",
  },
  {
    id: 137,
    name: "Polygon",
    chain: polygon,
    icon: "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1696501970",
  },
  {
    id: 56,
    name: "BSC",
    chain: bsc,
    icon: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1696501970",
  },
] as const;

export type ChainId = typeof CHAINS[number]["id"];
export const useEVM = () => {
  const { connect, connectors } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();

  const switchchain = async (chain: number) => {
    switchChain({ chainId: chain });
    console.log(chainId);
  };

  const ApproveUsdt = async (
    tokenAddress: string,
    abi: any,
    address: string,
    amount: number
  ) => {
    try {
      const ApproveResponse = await writeContract(config,{
        abi,
        address: tokenAddress as `0x${string}`,
        functionName: "approve",
        args: [address, amount],
      });
      console.log(ApproveResponse);
      return ApproveResponse;
    } catch (error) {
      console.log(error);
    }
  };

  const sendBulkTransAction = async (
    tokenAddress: string,
    abi: any,
    token: string,
    recipients: string[],
    amounts: number[] 
  ) => {
    try {
      const sendTransaction = await writeContract(config,{
        abi,
        address: tokenAddress as `0x${string}`,
        functionName: "batchTransfer",
        args: [token , recipients, amounts ],
      })
      console.log(sendTransaction);
      return sendTransaction;
    } catch (error) {
      console.log(error);
    }
  }
  return {
    connect,
    connectors,
    isConnected,
    address,
    disconnect,
    switchchain,
    chainId,
    ApproveUsdt,
    sendBulkTransAction
  };
};
