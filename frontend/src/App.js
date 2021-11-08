import logo from './logo.svg';
import './App.css';
import packageJson from "../package.json";
import LoadButton from "./LoadButton";
import AppExplanations from "./AppExplanations";
import AccountManager from "./controller/accountManager";
import faucetClaim from "./controller/faucet";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "react-global-configuration";
import configuration from './config.json';

config.set(configuration);

const accountManager = new AccountManager();

function App() {
  const [account, setAccount] = useState("Not connected");
  const [balance, setBalance] = useState(0);
  const [txLink, setTxLink] = useState("");

  return (
    <div className="App">
      <ToastContainer hideProgressBar={true} />
      <div className="App-banner">
          <img src={logo} className="App-logo" alt="logo" />
          <p className="App-title">Polygon Faucet</p>
        </div>
      <header className="App-header">
      <div className="Commands">
        <LoadButton
          text="Connect"
          loadingText="Loading..."
          color="#8248e5"
          hidden={account !== "Not connected"}
          onClick={() => accountManager.connect().then((account) => {
            if(!account){
              toast.error(`Wrong network: Please select Matic/Polygon network first`)
            }
            else{
              setAccount(account);
              accountManager.getBalance().then((balance) => {setBalance(balance)});
            }
          })}
        />
        <LoadButton
          text={Number(balance) >= config.get("maxAmount") ? "Balance too high" : "Receive"}
          loadingText="Sending..."
          color="#8248e5"
          disabled={Number(balance) >= config.get("maxAmount") || captcha === ""}
          hidden={account === "Not connected"}
          onClick={() => faucetClaim(account, captcha)
            .then((hash) => {
              toast.success("Transaction sent!");
              setTxLink(hash);
              setBalance(accountManager.getFormattedBalance(Number(accountManager.balance+config.get("maxAmount")), 18));
            })
            .catch((error) => {
              toast.error(`${error.response.data.err.message} 🙅`)})
          }
        />
      </div>
      <p hidden={account === "Not connected"}>{account}</p>
      <p hidden={account === "Not connected"}>{"Your balance: " + String(balance)}</p>
      <a hidden={txLink === ""} target="_blank" rel="noopener noreferrer" href={txLink}>{txLink}</a>
      <br></br>
      </header>
    </div>
  );
}

export default App;
