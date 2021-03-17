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
import { isToday } from "date-fns";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

function App() {
  const [basePrice, setBasePrice] = useState("");
  const [lotSize, setLotSize] = useState(1);
  const [decision, setDecision] = useState("LONG");
  const [requestToken, setRequestToken] = useState("");
  const [lastTrade, setLastTrade] = useState({});
  const initialTransactions = [
    { transactionType: "BUY", optionType: "CALL", inTheMoney: 15000 },
    { transactionType: "SELL", optionType: "PUT", inTheMoney: 15000 },
    { transactionType: "BUY", optionType: "PUT", inTheMoney: 15000 },
  ];
  const [transactions, setTransactions] = useState(initialTransactions);
  const [expiry, setExpiry] = useState(new Date());

  const apiEndpoint = useRef(null);
  const tradeRef = useRef();

  const request_token = new URLSearchParams(window.location.search).get('request_token');
  console.log('request_token: ', request_token);

  useEffect(() => {
    if (!request_token) return;
    setRequestToken(request_token);
  }, [request_token])
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

  const handleExpiryChange = (date) => {
    setExpiry(date);
  }

  const handleTransactionChange = (index, event) => {
    const _transactions = [...transactions];
    _transactions[index][event.target.name] = event.target.value;
    setTransactions(_transactions);
  };

  const handleConnect = () => {
    const tab = window.open(
      `https://kite.trade/connect/login?api_key=${process.env.REACT_APP_API_KEY}&v=3`,
      "_self"
    );
    tab.focus();
  };

  const getLatestTrade = async () => {
    await axios
      .get(`${apiEndpoint.current}/api/lastPrice`)
      .then(({ data }) => {
        console.log(data[0].date);
        if (isToday(new Date(data[0].date))) {
          setLastTrade({ ...data[0] });
        }
        console.log({ ...data[0] });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const disableWeekends = (date) => {
    return date.getDay() === 0 || date.getDay() === 6;
  }

  useEffect(() => {
    console.log("Current Environment Status: ", process.env.NODE_ENV);
    apiEndpoint.current =
      process.env.NODE_ENV === "development"
        ? `http://localhost:5000`
        : `https://nameless-cove-63960.herokuapp.com`;
    getLatestTrade();
  }, []);

  useEffect(() => {
    if (!requestToken) return;
    tradeRef.current.scrollIntoView();
  }, [transactions, requestToken]);

  const handleStartTrading = async () => {
    await axios
      .post(`${apiEndpoint.current}/api/price`, {
        basePrice,
        lotSize,
        decision,
        expiry,
        requestToken,
        transactions,
      })
      .then((response) => {
        setRequestToken(null);
        getLatestTrade();
        alert(response.data);
      })
      .catch((error) => alert("Error: Check the Access Token", error));
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
        {!requestToken &&
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 80px)' }}>
            <button className="connectBtn" onClick={handleConnect}>
              Connect
        </button>
          </div>
        }
        {requestToken && (<>
          <div className="price">
            <TextField
              label="Cut off Price"
              type="number"
              style={{ width: '120px' }}
              className="priceInput"
              aria-label="base-price"
              step={50}
              value={basePrice}
              onChange={handleBasePriceChange}
              autoFocus
            />
            <div className="spacer"></div>
            <TextField
              label="Lot Size"
              type="number"
              className="priceInput"
              style={{ width: '120px' }}
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
            <div className="spacer"></div>
            <MuiPickersUtilsProvider utils={DateFnsUtils} style={{ marginTop: `0px !important` }}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                id="expiry"
                label="Expiry"
                value={expiry}
                autoOk
                onChange={handleExpiryChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                shouldDisableDate={disableWeekends}
              />
            </MuiPickersUtilsProvider>
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
        </>)}
      </div>
      <div className="activeSection">
        <h3>Active Strike and Trades</h3>
        {Object.keys(lastTrade).length ? (
          <div className="activeTrade">
            <h3>{lastTrade.basePrice}</h3>
            <p>Cut-off Price</p>
            <h3>{lastTrade.decision}</h3>
            <p>Decision</p>
            <h3>{lastTrade.lotSize}</h3>
            <p>Lot size</p>
            <table>
              <thead>
                <tr>
                  <th>Transaction Type</th>
                  <th>Option Type</th>
                  <th>Strike Price</th>
                </tr>
              </thead>
              <tbody>
                {lastTrade.transactions.map((transaction, index) => {
                  return (
                    <tr key={index}>
                      <td>{transaction.transactionType}</td>
                      <td>{transaction.optionType}</td>
                      <td>{transaction.inTheMoney}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No Trades placed yet</p>
        )}
      </div>
    </div>
  );
}

export default App;
