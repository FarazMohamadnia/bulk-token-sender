import { useEffect, useState } from "react";
import AddressTable, { type User } from "../../common/AddressTable";
// import TokenSelector from "../../common/token";
import { useChainStore } from "../../../store/chain";
import { TonTokens } from "../../../config/tonTokenConfig";
import { toUserFriendlyAddress } from "@tonconnect/ui-react";
import { useTVM } from "../../../module/tvmBase";
import { useEVM } from "../../../module/evmBase";
import {
  Bulk_Contract_ABI,
  smartContract,
  USDT_Contract,
} from "../../../config/smartContract";
import { API } from "../../../api";
import { fetchData } from "../../../utils/fetch";
import Swal from "sweetalert2";
import { useSVM } from "../../../module/svmBase";

export default function Section1() {
  const [userData, setUserData] = useState<User[]>([]);
  const [packetData, setPacketData] = useState<any>([]);
  const [value, setValue] = useState<number>(0);
  const [hash, setHash] = useState<string>("");
  const token = localStorage.getItem("token");
  const [btnLoading, setBtnLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const { chain } = useChainStore();
  const { sendTonTransaction } = useTVM();
  const { chainId, ApproveUsdt, sendBulkTransAction } = useEVM();
  const { sendSplBatchTokenTransaction } = useSVM();

  const customTonData = () => {
    userData.map((user) => {
      const customData = {
        coinamount: user.transaction?.token_amount,
        decimal: TonTokens["USDT"].decimal,
        OwnerAddress: toUserFriendlyAddress(user.transaction?.wallet || ""), // owner address
        recipientAddress: TonTokens["USDT"].reciverAddress, // recipient address
      };
      packetData.push(customData);
    });
  };

  const sendtontransaction = async () => {
    setBtnLoading(true);
    try {
      if (chain === "ton") {
        const response = await sendTonTransaction(packetData);
        setHash(response);
        setBtnLoading(false);
      } else if (chain === "bsc") {
        const response = await ApproveUsdt(
          USDT_Contract.bsc.address,
          USDT_Contract.bsc.abi,
          smartContract.bsc.address,
          value * 10 ** USDT_Contract.bsc.decimal
        );
        if (response) {
          const sendTransaction = await sendBulkTransAction(
            smartContract.bsc.address,
            Bulk_Contract_ABI,
            USDT_Contract.bsc.address,
            userData.map((user) => user.transaction?.wallet || ""),
            userData.map(
              (user) =>
                (user.transaction?.token_amount || 0) *
                10 ** USDT_Contract.bsc.decimal
            )
          );
          console.log(sendTransaction);
          setHash(sendTransaction as `0x${string}`);
          setBtnLoading(false);
        } else {
          return console.log("Approve failed");
          setBtnLoading(false);
        }
      } else if (chain === "polygon") {
        const response = await ApproveUsdt(
          USDT_Contract.polygon.address,
          USDT_Contract.polygon.abi,
          smartContract.polygon.address,
          value * 10 ** USDT_Contract.polygon.decimal
        );
        if (response) {
          const sendTransaction = await sendBulkTransAction(
            smartContract.polygon.address,
            Bulk_Contract_ABI,
            USDT_Contract.polygon.address,
            userData.map((user) => user.transaction?.wallet || ""),
            userData.map(
              (user) =>
                (user.transaction?.token_amount || 0) *
                10 ** USDT_Contract.polygon.decimal
            )
          );
          console.log(sendTransaction);
          setHash(sendTransaction as `0x${string}`);
          setBtnLoading(false);
        } else {
          return console.log("Approve failed");
          setBtnLoading(false);
        }
      } else if (chain === "ethereum") {
        const response = await ApproveUsdt(
          USDT_Contract.ethereum.address,
          USDT_Contract.ethereum.abi,
          smartContract.ethereum.address,
          value * 10 ** USDT_Contract.ethereum.decimal
        );
        if (response) {
          const sendTransaction = await sendBulkTransAction(
            smartContract.ethereum.address,
            Bulk_Contract_ABI,
            USDT_Contract.ethereum.address,
            userData.map((user) => user.transaction?.wallet || ""),
            userData.map(
              (user) =>
                (user.transaction?.token_amount || 0) *
                10 ** USDT_Contract.ethereum.decimal
            )
          );
          console.log(sendTransaction);
          setHash(sendTransaction as `0x${string}`);
          setBtnLoading(false);
        } else {
          return console.log("Approve failed");
          setBtnLoading(false);
        }
      }else if(chain === "sol"){
        const response = await sendSplBatchTokenTransaction('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',userData.map((user) => ({
          address: user.transaction?.wallet || "",
          amount: (user.transaction?.token_amount || 0) * 10 ** USDT_Contract.ethereum.decimal
        })))
        console.log(response);
        setHash(response[0]);
        setBtnLoading(false);

      }
    } catch (err) {
      console.log(err);
      setBtnLoading(false);
    }
  };

  const AccessTransition = async () => {
    console.log(userData);
    try {
      if (!hash) return console.log("hash does not exist");
      const ordersIdList = userData.map((user) => user.id);
      console.log(ordersIdList);
      const response = await fetchData({
        url: API.verifyOrder,
        method: "POST",
        authToken: token || "",
        body: {
          orders_id_list: ordersIdList,
          hash: hash,
        },
      });

      // console.log(response?.status);
      if (response?.status == 400 || response?.status == 404) {
        Swal.fire({
          text: "Error in sending data",
          icon: "error",
        });
      } else {
        Swal.fire({
          icon: "success",
          text: "sendData ",
        });
      }
    } catch (err: any) {
      Swal.fire({
        title: "error !!!",
        text: err.response.data.error,
        icon: "error",
      });
      console.log(err);
    }
  };

  useEffect(() => {
    if (chain === "ton" && !flag) {
      customTonData();
      setFlag(true);
    }
  }, [userData]);


  useEffect(() => {
    setPacketData([])
  }, []);

  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <div>{/* <TokenSelector /> */}</div>
      <p>Active Evm Chain : {chainId}</p>
      <div>
        <input
          className="bg-white text-black px-2 py-2 rounded-xl border border-gray-500 mr-2 w-80"
          type="text"
          placeholder="Enter hash"
          value={hash}
          onChange={(e) => setHash(e.target.value)}
        />
        <button
          className="bg-white text-black px-2 py-2 rounded-xl border border-gray-500 mr-2"
          onClick={AccessTransition}
        >
          Send Hash
        </button>
      </div>
      <div>
        <AddressTable
          setUserData={setUserData}
          userData={userData}
          value={value}
          setValue={setValue}
        />
      </div>
      <button
        onClick={sendtontransaction}
        disabled={btnLoading}
        className="bg-white border-2 border-black text-black px-10 py-2 rounded-md"
      >
        {btnLoading ? "Sending..." : "Send"}
      </button>
    </div>
  );
}
