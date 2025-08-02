import Chain from "../components/common/chain";
import ConnectWallet from "../components/common/connectWallet";
import Section from "../components/layout/section";
import { useEffect } from "react";
import { getUserJettons, useTVM } from "../module/tvmBase";
import { toUserFriendlyAddress } from "@tonconnect/ui-react";
import { useNavigate } from "react-router-dom";

  export default function Home() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
      if(!token){
        navigate('/login')
      }
    }, [token]);
    const { isConnected , address } = useTVM();
    useEffect(() => {
      if(isConnected){
        getUserJettons(address ? toUserFriendlyAddress(address) : "")
      }
    }, [isConnected ,address]); 
    return (
      <div>
        <Chain />
        <ConnectWallet />
        <Section />
      </div>
    )
  }