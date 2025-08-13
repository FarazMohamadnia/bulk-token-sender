import { useEffect, useState } from "react";
import { fetchData } from "../../../utils/fetch";
import { API } from "../../../api";
import { toUserFriendlyAddress } from "@tonconnect/ui-react";
import { useChainStore } from "../../../store/chain";
import { useNavigate } from "react-router-dom";
export interface User {
  id?: number;
  transaction?: {
    wallet?: string;
    ton_amount?: number;
    token_amount?: number;
    network?: string;
    id?: number;
  };
}

export default function AddressTable({
  setUserData,
  userData,
  value,
  setValue,
}: {
  setUserData: (users: User[]) => void;
  userData: User[];
  value: number;
  setValue: (value: number) => void;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<string>("ALL");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { chain } = useChainStore();
  //   const networks = ["ALL", "TON", "ETHEREUM", "BNB", "POL", "SOL"];

  const getUsers = async () => {
    const response = await fetchData({
      url: API.getOrders,
      method: "GET",
      authToken: token || "",
    });
    if(response.status == 401){
      localStorage.removeItem("token");
      navigate("/login");
    }
    // Merge all arrays from the response
    if (response?.data?.orders) {
      const allOrders = response.data.orders.flat();
      setUsers(allOrders);
      setFilteredUsers(allOrders);
      const totalTokenAmount = allOrders.reduce(
        (sum: number, user: User) =>
          sum + (user.transaction?.token_amount || 0),
        0
      );

      setValue(totalTokenAmount);
    }
  };

  const filterByNetwork = (network: string) => {
    setSelectedNetwork(network);
    if (network === "ALL") {
      setFilteredUsers(users);
      const totalTokenAmount = users.reduce(
        (sum: number, user: User) =>
          sum + (user.transaction?.token_amount || 0),
        0
      );
      setValue(totalTokenAmount);
    } else {
      const filtered = users.filter(
        (user) =>
          user.transaction?.network?.toUpperCase() === network.toUpperCase()
      );
      setFilteredUsers(filtered);
      const totalTokenAmount = filtered.reduce(
        (sum: number, user: User) =>
          sum + (user.transaction?.token_amount || 0),
        0
      );
      setValue(totalTokenAmount);
    }
  };


  const renderUsers = () => {
    return filteredUsers.map(
      (user, index) => (
        (
          <div
            key={index}
            className="flex justify-between py-1 border-b items-center"
          >
            <div className="flex">
              <span className="mr-1">{index + 1} -</span>
              <p className="text-[15px] mr-3">
                {user.transaction?.network === "TON"
                  ? toUserFriendlyAddress(user?.transaction?.wallet || "")
                  : user.transaction?.wallet || "N/A"}
              </p>
            </div>
            <p>
              {(user?.transaction?.token_amount || 0).toFixed(5) || "N/A"}
            </p>
          </div>
        )
      )
    );
  };

  // Update userData state when filteredUsers changes
  useEffect(() => {
    setUserData(filteredUsers);
  }, [filteredUsers]);

  useEffect(() => {
    getUsers();
  }, []);
  useEffect(() => {
    if (chain) {
      filterByNetwork(chain.toString());
    }
  }, [chain]);
  console.log(userData);

  return (
    <div className="min-w-[350px] h-[700px] bg-white/20 backdrop-blur-md rounded-xl p-3 text-center overflow-scroll border border-white/30 shadow-2xl">
      <p className="font-bold text-white">Customers</p>
      <p className="text-white">Chain : {selectedNetwork} </p>
      <p className="text-white">Total Value: {value.toFixed(5)}$</p>
      <div>
        <div className="flex justify-between py-1 border-b border-white/30 items-center text-white">
          <div className="flex">
            <span className="mr-1">Network</span>
            <p className="text-[15px]">Wallet</p>
          </div>
          <p>Amount</p>
        </div>
        {renderUsers()}
      </div>
    </div>
  );
}
