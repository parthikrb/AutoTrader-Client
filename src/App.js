/* eslint-disable no-unused-vars */
import "./App.css";
import React, { useState } from "react";
import axios from "axios";
import {
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
} from "@material-ui/core";
import OrderSelection from "./components/OrderSelection/OrderSelection";

function App() {
  const [basePrice, setBasePrice] = useState("");
  const [lotSize, setLotSize] = useState(1);
  const [decision, setDecision] = useState("LONG");
  const [requestToken, setRequestToken] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [transaction1, setTransaction1] = useState({});
  const [transaction2, setTransaction2] = useState({});
  const [transaction3, setTransaction3] = useState({});

  const handleBasePriceChange = (event) => {
    setBasePrice(event.target.value);
  };

  const handleLotSizeChange = (event) => {
    setLotSize(event.target.value);
  };

  const handleRequestTokenChange = (event) => {
    setRequestToken(event.target.value);
  };

  const handleDecisionChange = (event) => {
    setDecision(event.target.value);
  };
  const handleConnect = () => {
    const tab = window.open(
      "https://kite.trade/connect/login?api_key=eqtx7e356zu0fky2&v=3",
      "_blank"
    );
    tab.focus();
  };

  const handleStartTrading = async () => {
    setTransactions([]);
    const _transactions = transactions;
    if (Object.keys(transaction1).length) _transactions.push(transaction1);
    if (Object.keys(transaction2).length) _transactions.push(transaction2);
    if (Object.keys(transaction3).length) _transactions.push(transaction3);
    setTransactions(_transactions);

    await axios
      .post("https://nameless-cove-63960.herokuapp.com/api/price", {
        basePrice,
        lotSize,
        requestToken,
        transactions,
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
        <div className="price">
          <TextField
            label="Cut off Price"
            type="number"
            className="priceInput"
            aria-label="base-price"
            value={basePrice}
            onChange={handleBasePriceChange}
            autoFocus
          />
          <div className="spacer"></div>
          <TextField
            label="Lot Size"
            type="number"
            className="priceInput"
            aria-label="lot-size"
            value={lotSize}
            onChange={handleLotSizeChange}
          />
          <div className="spacer"></div>
          <FormControl component="fieldset">
            <FormLabel component="legend">Take Long / Short?</FormLabel>
            <RadioGroup
              aria-label="decision-type"
              style={{ display: "block" }}
              name="decisionType"
              value={decision}
              onChange={handleDecisionChange}
            >
              <FormControlLabel
                value="LONG"
                control={<Radio color="primary" />}
                label="Long"
              />
              <FormControlLabel
                value="SHORT"
                control={<Radio color="secondary" />}
                label="Short"
              />
            </RadioGroup>
          </FormControl>
        </div>
        <div className="token">
          <TextField
            label="Request token"
            type="text"
            className="textInput"
            aria-label="request-token"
            value={requestToken}
            onChange={handleRequestTokenChange}
          />
        </div>
        <div className="transactions">
          <OrderSelection addTransaction={setTransaction1} />
          <OrderSelection addTransaction={setTransaction2} />
          <OrderSelection addTransaction={setTransaction3} />
        </div>

        <button className="startBtn" onClick={handleStartTrading}>
          Start Trading
        </button>
      </div>
    </div>
  );
}

export default App;
