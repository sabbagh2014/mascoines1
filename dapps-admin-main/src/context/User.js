import React, { createContext, useEffect } from "react";
import { injected } from "src/connectors";
import { useWeb3React } from "@web3-react/core";

export const UserContext = createContext();

const setSession = (userAddress) => {
  if (userAddress) {
    sessionStorage.setItem("userAddress", userAddress);
  } else {
    sessionStorage.removeItem("userAddress");
  }
};

export default function AuthProvider(props) {
  const { activate, account } = useWeb3React();

  let data = {
    updateUser: () => {
      setSession(account);
    },
    connectWallet: () => {
      activate(injected, undefined, true).catch((error) => {
        if (error) {
          activate(injected);
        }
      });
    },
  };

  useEffect(() => {
    const userAddress = window.sessionStorage.getItem("userAddress");
    if (userAddress) {
      data.connectWallet();
    } 
  }, []); //eslint-disable-line

  useEffect(() => {
    data.updateUser(account);
  }, [account]); //eslint-disable-line

  return (
    <UserContext.Provider value={data}>{props.children}</UserContext.Provider>
  );
}
