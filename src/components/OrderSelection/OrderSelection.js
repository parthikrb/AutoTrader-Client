import React from 'react';
import {
    Grid,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    TextField,
    Fab
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const OrderSelection = (props) => {
    const {
        transactionType,
        optionType,
        inTheMoney,
        addTransaction,
        newTransaction,
        removeTransaction } = props;

    return (
        <Grid container spacing={3}>
            <Grid item xs={3}>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Transaction Type</FormLabel>
                    <RadioGroup
                        aria-label="transaction-type"
                        style={{ display: 'block' }}
                        name="transactionType"
                        value={transactionType}
                        onChange={addTransaction}>
                        <FormControlLabel value="BUY" control={<Radio color="primary" />} label="Buy" />
                        <FormControlLabel value="SELL" control={<Radio color="secondary" />} label="Sell" />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={3}>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Option Type</FormLabel>
                    <RadioGroup
                        aria-label="option-type"
                        style={{ display: 'block' }}
                        name="optionType" value={optionType}
                        onChange={(event, index) => addTransaction(event, index)}>
                        <FormControlLabel value="CALL" control={<Radio color="primary" />} label="Call" />
                        <FormControlLabel value="PUT" control={<Radio color="secondary" />} label="Put" />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={3}>
                <TextField
                    id="strike-price"
                    label="Strike Price"
                    type="number"
                    name="inTheMoney"
                    value={inTheMoney}
                    onChange={(event, index) => addTransaction(event, index)} />
            </Grid>
            <Grid item xs={3}>
                <Fab color="primary" size="small"
                    aria-label="add" style={{ margin: '10px' }}
                    onClick={newTransaction}>
                    <AddIcon />
                </Fab>
                <Fab color="secondary" size="small"
                    aria-label="remove" style={{ margin: '10px' }}
                    onClick={removeTransaction}
                >
                    <DeleteForeverIcon />
                </Fab>
            </Grid>
        </Grid>
    )
}

export default OrderSelection;
