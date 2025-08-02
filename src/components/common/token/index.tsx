import { useState, useMemo, useRef, useEffect } from "react";
import { useChainStore } from "../../../store/chain";

const TOKENS = {
  TON: {
    label: "USDT",
    value: "usdt",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
  },
  ETHEREUM: {
    label: "USDC",
    value: "usdc",
    address: "0xA0b86a33E6441b8C4C8C8C8C8C8C8C8C8C8C8C8C",
    decimals: 6,
  },
  POL: {
    label: "USDC",
    value: "usdc",
    address: "0xA0b86a33E6441b8C4C8C8C8C8C8C8C8C8C8C8C8C",
    decimals: 6,
  },
  BSC: {
    label: "USDC",
    value: "usdc",
    address: "0xA0b86a33E6441b8C4C8C8C8C8C8C8C8C8C8C8C8C",
    decimals: 6,
  },
  SOL: {
    label: "USDC",
    value: "usdc",
    address: "0xA0b86a33E6441b8C4C8C8C8C8C8C8C8C8C8C8C8C",
    decimals: 6,
  },
};

interface TokenSelectorProps {
  onTokenSelect?: (token: {
    label: string;
    value: string;
    address: string;
    decimals: number;
  }) => void;
  placeholder?: string;
}

export default function TokenSelector({
  onTokenSelect,
  placeholder = "Select token to send...",
}: TokenSelectorProps) {
  const { chain } = useChainStore();
  const [filterText, setFilterText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedToken, setSelectedToken] = useState<{
    label: string;
    value: string;
    address: string;
    decimals: number;
  } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get tokens for the selected chain
  const getTokensForChain = () => {
    if (!chain) return [];
    const chainKey = chain.toString().toUpperCase();
    const chainTokens = TOKENS[chainKey as keyof typeof TOKENS];
    return chainTokens ? [chainTokens] : [];
  };

  const availableTokens = getTokensForChain();

  const filteredTokens = useMemo(() => {
    return availableTokens.filter(
      (t) =>
        t.label.toLowerCase().includes(filterText.toLowerCase()) ||
        t.value.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [filterText, availableTokens]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (token: {
    label: string;
    value: string;
    address: string;
    decimals: number;
  }) => {
    setSelectedToken(token);
    setInputValue(token.label);
    setFilterText("");
    setIsOpen(false);
    onTokenSelect?.(token);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setFilterText(value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (!inputValue) {
      setFilterText("");
    }
  };

  useEffect(() => {
    console.log(selectedToken);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: "relative", width: "300px" }}>
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        style={{
          width: "100%",
          padding: "8px 12px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "8px",
          fontSize: "14px",
          backgroundColor: "rgba(128, 128, 128, 0.1)",
          backdropFilter: "blur(10px)",
          color: "white",
          outline: "none",
        }}
      />

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "rgba(64, 64, 64, 0.8)",
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "8px",
            maxHeight: "200px",
            overflowY: "auto",
            zIndex: 1000,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            marginTop: "4px",
          }}
        >
          {filteredTokens.length > 0 ? (
            filteredTokens.map((token) => (
              <div
                key={token.value}
                onClick={() => handleSelect(token)}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                  fontSize: "14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "white",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <span>{token.label}</span>
                <span
                  style={{
                    fontSize: "12px",
                    color: "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  {token.address.slice(0, 6)}...{token.address.slice(-4)}
                </span>
              </div>
            ))
          ) : (
            <div
              style={{
                padding: "8px 12px",
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "14px",
              }}
            >
              No tokens found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
