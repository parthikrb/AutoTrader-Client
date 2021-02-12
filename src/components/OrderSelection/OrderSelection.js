import React, { useState, useEffect } from 'react';
import {
    Grid,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    TextField
} from '@material-ui/core';

const OrderSelection = (props) => {
    const [transactionType, setTransactionType] = useState("BUY");
    const [optionType, setOptionType] = useState("CALL");
    const [inTheMoney, setInTheMoney] = useState("");
    const { addTransaction } = props;

    useEffect(() => {
        if (transactionType && optionType && inTheMoney) {
            addTransaction({
                transactionType,
                optionType,
                inTheMoney
            })
        }
    }, [transactionType, optionType, inTheMoney, addTransaction])

    const handleTransactionTypeChange = (event) => {
        setTransactionType(event.target.value);
    };

    const handleOptionTypeChange = (event) => {
        setOptionType(event.target.value)
    }

    const handleInTheMoneyChange = (event) => {
        setInTheMoney(event.target.value);
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={4}>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Transaction Type</FormLabel>
                    <RadioGroup aria-label="transaction-type" style={{ display: 'block' }} name="transactionType" value={transactionType} onChange={handleTransactionTypeChange}>
                        <FormControlLabel value="BUY" control={<Radio color="primary" />} label="Buy" />
                        <FormControlLabel value="SELL" control={<Radio color="secondary" />} label="Sell" />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={4}>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Option Type</FormLabel>
                    <RadioGroup aria-label="option-type" style={{ display: 'block' }} name="optionType" value={optionType} onChange={handleOptionTypeChange}>
                        <FormControlLabel value="CALL" control={<Radio color="primary" />} label="Call" />
                        <FormControlLabel value="PUT" control={<Radio color="secondary" />} label="Put" />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={4}>
                <TextField id="strike-price" label="Strike Price" type="number" value={inTheMoney} onChange={handleInTheMoneyChange} />
            </Grid>
        </Grid>
    )
}

export default OrderSelection
