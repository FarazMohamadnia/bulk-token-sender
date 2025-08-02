export const smartContract = {
  polygon: {
    address: "0xbF84Be4Eee21606595694E32f37ee10B45593887",
  },
  ethereum: {
    address: "0x6eb98440518F2eb4c167b44B313bE9d955Dd1989",
  },
  bsc: {
    address: "0xa6eb6f6822eB1DF25a14AE3EA496f1220A4B0d9B",
  },
};
export const Bulk_Contract_ABI =[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			}
		],
		"name": "SafeERC20FailedOperation",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "totalTransfers",
				"type": "uint256"
			}
		],
		"name": "BatchTransfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"internalType": "address[]",
				"name": "recipients",
				"type": "address[]"
			},
			{
				"internalType": "uint256[]",
				"name": "amounts",
				"type": "uint256[]"
			}
		],
		"name": "batchTransfer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

export const USDT_Contract = {
  polygon: {
    address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    abi:  [
        {
          constant: false,
          inputs: [
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
          ],
          name: "approve",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      decimal: 6
  },
  ethereum: {
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    abi:  [
        {
          constant: false,
          inputs: [
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
          ],
          name: "approve",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      decimal: 6,
  },
  bsc: {
    address: "0x55d398326f99059ff775485246999027b3197955",
    abi: [
      {
        constant: false,
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    decimal: 18,
  },
};
