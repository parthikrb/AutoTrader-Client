/* eslint-disable no-unused-vars */
import "./App.css";
import React, { useState, useEffect, useRef } from "react";
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
  const initialTransactions = [
    { transactionType: "BUY", optionType: "CALL", inTheMoney: 15000 },
    { transactionType: "SELL", optionType: "PUT", inTheMoney: 15000 },
    { transactionType: "BUY", optionType: "PUT", inTheMoney: 15000 },
  ];
  const [transactions, setTransactions] = useState(initialTransactions);

  const apiEndpoint = useRef("https://nameless-cove-63960.herokuapp.com");
  const tradeRef = useRef();

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

  const handleTransactionChange = (index, event) => {
    const _transactions = [...transactions];
    _transactions[index][event.target.name] = event.target.value;
    setTransactions(_transactions);
  };

  const handleConnect = () => {
    const tab = window.open(
      `https://kite.trade/connect/login?api_key=eqtx7e356zu0fky2&v=3`,
      "_blank"
    );
    tab.focus();
  };

  useEffect(() => {
    console.log("Current Environment Status: ", process.env.NODE_ENV);
    apiEndpoint.current =
      process.env.NODE_ENV === "development" && `http://localhost:5000`;
  }, []);

  useEffect(() => {
    tradeRef.current.scrollIntoView();
  }, [transactions]);

  const handleStartTrading = async () => {
    await axios
      .post(`${apiEndpoint.current}/api/price`, {
        basePrice,
        lotSize,
        decision,
        requestToken,
        transactions,
      })
      .then((response) => alert("Started Successfully"))
      .catch((error) => alert(error));
  };

  const handleNewTransaction = (index) => {
    setTransactions([
      ...transactions,
      {
        transactionType: "BUY",
        optionType: "CALL",
        inTheMoney: 15000,
      },
    ]);
  };

  const handleRemoveTransaction = (index) => {
    const newTransaction = [...transactions];
    newTransaction.splice(index, 1);
    setTransactions(newTransaction);
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
          {transactions.map((transaction, index) => {
            const { transactionType, optionType, inTheMoney } = transaction;
            return (
              <OrderSelection
                key={index}
                transactionType={transactionType}
                optionType={optionType}
                inTheMoney={inTheMoney}
                addTransaction={(event) =>
                  handleTransactionChange(index, event)
                }
                newTransaction={() => handleNewTransaction(index)}
                removeTransaction={() => handleRemoveTransaction(index)}
              />
            );
          })}
        </div>

        <button
          className="startBtn"
          onClick={handleStartTrading}
          ref={tradeRef}
        >
          Start Trading
        </button>
      </div>
    </div>
  );
}

export default App;
