import { useEVM } from "../../../module/evmBase";
import { useChainStore } from "../../../store/chain";

const CHAINS = [
  { label: "Ethereum", value: "ethereum" },
  { label: "Polygon", value: "polygon" },
  { label: "BNB Chain", value: "bsc" },
  { label: "TON", value: "ton" },
  { label: "Sepolia (Testnet)", value: "sepolia" },
];

export default function Chain() {
  const { switchchain } = useEVM();
  const chain = useChainStore((s) => s.chain);
  const setChain = useChainStore((s) => s.setChain);
  return (
    <div className="text-center my-3">
      <select value={chain ?? ""} onChange={(e) => {
        setChain(e.target.value)
        if(e.target.value === "bsc"){
          switchchain(56)
        }else if(e.target.value === "polygon"){
          switchchain(137)
        }else if(e.target.value === "ethereum"){
          switchchain(1)
        }else if(e.target.value === "sepolia"){
          switchchain(11155111)
        }
        }} className="bg-white text-black px-3 py-2 rounded-md hover:bg-gray-200">
        <option value="" disabled>
          Select a chain
        </option>
        {CHAINS.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
    </div>
  );
}
