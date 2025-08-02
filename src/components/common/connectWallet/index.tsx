import { toUserFriendlyAddress } from "@tonconnect/ui-react";
import { useEVM } from "../../../module/evmBase";
import { useTVM } from "../../../module/tvmBase";
import { useChainStore } from "../../../store/chain";
import { useState } from "react";

export default function ConnectWallet() {
  const { chain } = useChainStore();
  const { connectors, connect, address : evmAddress, isConnected , disconnect } = useEVM();
  const {
    tonConnect,
    address: tonAddress,
    isConnected: isTonConnected,
    disconnectTon
  } = useTVM();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleConnect = async () => {
    if (chain === "ton") {
      tonConnect();
    } else if (
      chain === "ethereum" ||
      chain === "polygon" ||
      chain === "bsc" ||
      chain === "sepolia"
    ) {
      connect({ connector: connectors[0] });
    } else {
      console.log("solana");
    }
  };

  const handleConnectAnother = async () => {
    // Open wallet selection modal for another wallet
    if (chain === "ton") {
      tonConnect();
    } else if (
      chain === "ethereum" ||
      chain === "polygon" ||
      chain === "bsc" ||
      chain === "sepolia"
    ) {
      connect({ connector: connectors[0] });
    } else {
      console.log("solana");
    }
    setShowDropdown(false);
  };

  const handleDisconnect = async() => {
    // Add disconnect logic here
    await disconnectTon();
    await disconnect();
    setShowDropdown(false);
  };

  const formatAddress = (address: string | undefined) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isWalletConnected = isConnected || isTonConnected;
  
  return (
    <div className="text-center my-3 relative">
      {!isWalletConnected ? (
        <button
          onClick={handleConnect}
          className="bg-white text-black px-8 py-2 rounded-md hover:bg-gray-200"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-white text-black px-8 py-2 rounded-md hover:bg-gray-200 flex items-center gap-2 mx-auto"
          >
            <span>{formatAddress(isTonConnected ? toUserFriendlyAddress(tonAddress ?? "") : evmAddress)}</span>
            <svg
              className={`w-4 h-4 transition-transform ${
                showDropdown ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <div className="p-3 border-b border-gray-200">
                <p className="text-sm text-gray-600">Connected Address</p>
                <p className="text-sm font-mono text-black break-all">
                  {isConnected && evmAddress}
                </p>
                <p className="text-sm font-mono text-black break-all">
                  {isTonConnected &&  toUserFriendlyAddress(tonAddress ?? "")}
                </p>
              </div>
              <div className="p-2">
                <button
                  onClick={handleConnectAnother}
                  className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded mb-1"
                >
                  Connect Another Wallet
                </button>
                <button
                  onClick={handleDisconnect}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
