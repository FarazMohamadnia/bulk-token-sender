import {
  useTonConnectUI,
  useTonWallet,
  toUserFriendlyAddress,
} from "@tonconnect/ui-react";
import { beginCell, Address, toNano } from "@ton/core";
import { fetchData } from "../utils/fetch";
import { useTonTokenStore } from "../store/TonToken";

export async function getUserJettons(user: string) {
  console.log("start ..... === userAddress  :: ", user);
  try {
    const response = await fetchData({
      url: `https://toncenter.com/api/v3/jetton/wallets?owner_address=${user.toString()}&limit=10&offset=0`,
      method: "GET",
    });

    if (response?.data?.jetton_wallets) {
      const jettonWallets = response.data.jetton_wallets;
      const updatedUserAddress = { ...useTonTokenStore.getState().tokens };

      jettonWallets.forEach((jettonWallet: any) => {
        Object.keys(updatedUserAddress).forEach((key) => {
          const currentJetton = updatedUserAddress[key];
          if (currentJetton.Jetton === jettonWallet.jetton) {
            updatedUserAddress[key].reciverAddress = toUserFriendlyAddress(
              jettonWallet.address
            );
          }
        });
      });

      useTonTokenStore.setState({ tokens: updatedUserAddress });
      console.log(
        "add ton tokens address ::",
        useTonTokenStore.getState().tokens
      );
    }
  } catch (error) {
    console.error("Error fetching jettons:", error);
  }
}

export const useTVM = () => {
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const tonConnect = () => {
    tonConnectUI.openModal();
  };

  const disconnectTon = () => {
    tonConnectUI.disconnect();
  };

  function buildTransactionData(packetData: any[]) {
    const transactionData: any = [];

    packetData.map((data: any) => {
      const { coinamount, decimal, OwnerAddress, recipientAddress } = data;

      const price = Math.round(coinamount * decimal);
      const body = beginCell()
        .storeUint(0xf8a7ea5, 32)
        .storeUint(0, 64)
        .storeCoins(price)
        .storeAddress(Address.parse(OwnerAddress))
        .storeAddress(Address.parse(recipientAddress))
        .storeUint(0, 1)
        .storeCoins(toNano("0.01"))
        .storeUint(0, 1)
        .endCell()
        .toBoc()
        .toString("base64");

      transactionData.push({
        address: recipientAddress,
        amount: toNano("0.07").toString(),
        payload: body,
      });
    });

    return {
      validUntil: Math.floor(Date.now() / 1000) + 360,
      messages: transactionData,
    };
  }

  const sendTonTransaction = async (packetData: any): Promise<any> => {
    const myTransaction = buildTransactionData(packetData);

    try {
      const validate = await tonConnectUI.sendTransaction(myTransaction);
      // Assuming TonWeb is available globally or imported
      const bocCellBytes = await window.TonWeb.boc.Cell.oneFromBoc(
        window.TonWeb.utils.base64ToBytes(validate.boc)
      ).hash();
      const hashBase64 = window.TonWeb.utils.bytesToBase64(bocCellBytes);
      console.log("Transaction hash:", hashBase64);
      return hashBase64;
    } catch (error) {
      console.error("Transaction failed:", error);
      throw error; // Re-throw to allow handling by the caller
    }
  };
  return {
    tonConnect,
    address: wallet?.account?.address,
    isConnected: wallet?.account?.address ? true : false,
    disconnectTon,
    sendTonTransaction,
  };
};
