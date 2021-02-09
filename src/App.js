import "./App.css";
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [basePrice, setBasePrice] = useState(null);
  const [lotSize, setLotSize] = useState(null);
  const [requestToken, setRequestToken] = useState("");
  const [transactionType, setTransactionType] = useState("BUY");

  const handleBasePriceChange = (event) => {
    setBasePrice(event.target.value);
  };

  const handleLotSizeChange = (event) => {
    setLotSize(event.target.value);
  };

  const handleRequestTokenChange = (event) => {
    setRequestToken(event.target.value);
  };

  const handleTransactionTypeChange = (event) => {
    setTransactionType(event.target.value);
  };

  const handleConnect = () => {
    const tab = window.open(
      "https://kite.trade/connect/login?api_key=eqtx7e356zu0fky2&v=3",
      "_blank"
    );
    tab.focus();
  };

  const handleStartTrading = async () => {
    await axios
      .post("https://nameless-cove-63960.herokuapp.com/api/price", {
        basePrice,
        lotSize,
        transactionType,
        requestToken,
      })
      .then((response) => alert("Started Successfully"))
      .catch((error) => alert(error));
  };

  return (
    <div className="app">
      <div className="header">AutoTrader</div>
      <div className="container">
        <button className="connectBtn" onClick={handleConnect}>
          Connect
        </button>
        <input
          type="number"
          className="textInput"
          aria-label="base-price"
          placeholder="Base Price"
          value={basePrice}
          onChange={handleBasePriceChange}
        />
        <input
          type="number"
          className="textInput"
          aria-label="lot-size"
          placeholder="Lot Size"
          value={lotSize}
          onChange={handleLotSizeChange}
        />
        <input
          type="text"
          className="textInput"
          aria-label="request-token"
          placeholder="Request Token"
          value={requestToken}
          onChange={handleRequestTokenChange}
        />
        <div className="transaction">
          <input
            type="radio"
            id="buy"
            name="transactionType"
            value="BUY"
            checked={transactionType === "BUY"}
            onChange={handleTransactionTypeChange}
          />
          <label for="buy">Buy</label>
          <input
            type="radio"
            id="sell"
            name="transactionType"
            value="SELL"
            checked={transactionType === "SELL"}
            onChange={handleTransactionTypeChange}
          />
          <label for="sell">Sell</label>
        </div>

        <button className="startBtn" onClick={handleStartTrading}>
          Start Trading
        </button>
      </div>
    </div>
  );
}

export default App;
