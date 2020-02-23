import { Dialog, DialogTitle, DialogContent, Grid, DialogContentText, TextField, DialogActions, Button } from "@material-ui/core";
import React, { useState } from "react";
import { FactoryResponse } from "./api/responses";
import { FactoryRequest } from "./api/requests";

type EditFactoryDialogProps = {
    factory?: FactoryResponse;
    open: boolean;
    onClose: () => void;
    onSave: (request: FactoryRequest) => Promise<void>;
};

const validErrorState = {
    valid: true,
    errorText: '',
}

const MAX_INT = 2147483647;
const MAX_STRING_LENGTH = 255;

const DEFAULT_NAME = '';
const DEFAULT_MAX = 100;
const DEFAULT_MIN = 1;
const DEFAULT_NUMBER = 5;

export default function FactoryDialog({ factory, open, onClose, onSave}: EditFactoryDialogProps) {
    const [name, setName] = useState(factory ? factory.name : DEFAULT_NAME);
    const [max, setMax] = useState(factory ? factory.max : DEFAULT_MAX);
    const [min, setMin] = useState(factory ? factory.min : DEFAULT_MIN);
    const [number, setNumber] = useState(factory ? factory.values.length : DEFAULT_NUMBER);

    const [nameError, setNameError] = useState(validErrorState);
    const [maxError, setMaxError] = useState(validErrorState);
    const [minError, setMinError] = useState(validErrorState);
    const [numberError, setNumberError] = useState(validErrorState);

    const resetState = () => {
        if (factory) {
            setName(factory.name);
            setNameError(validErrorState);

            setMax(factory.max);
            setMaxError(validErrorState);

            setMin(factory.min);
            setMinError(validErrorState);

            setNumber(factory.values.length);
            setNumberError(validErrorState);
        } else {
            setName(DEFAULT_NAME);
            setMax(DEFAULT_MAX);
            setMin(DEFAULT_MIN);
            setNumber(DEFAULT_NUMBER);
        }
    }

    const handleClose = (): void => {
        resetState();
        onClose();
    }

    const isNameValid = (): boolean => {
        if (name === '') {
            setNameError({
                valid: false,
                errorText: 'Name is required',
            });

            return false;
        } else if (name.length > MAX_STRING_LENGTH) {
            setNameError({
                valid: false,
                errorText: 'Name is too long',
            });

            return false;
        }

        return true;
    }

    const isMaxValid = (maxValue: number, minValue: number): boolean => {
        if (maxValue > MAX_INT) {
            setMaxError({
                valid: false,
                errorText: `Value must be less than ${MAX_INT}`
            });

            return false;
        } else if (maxValue <= minValue) {
            setMaxError({
                valid: false,
                errorText: `Value must be larger than ${minValue}`
            });

            return false;
        } else if (maxValue <= 0) {
            setMaxError({
                valid: false,
                errorText: `Value cannot be less than 0`
            });

            return false;
        }

        setMaxError(validErrorState);
        return true;
    }

    const isMinValid = (minValue: number, maxValue: number): boolean => {
        if (minValue >= maxValue) {
            setMinError({
                valid: false,
                errorText: `Value must be less than ${maxValue}`
            });

            return false;
        } else if (minValue < 0) {
            setMinError({
                valid: false,
                errorText: 'Value cannot be less than 0'
            });

            return false;
        }

        setMinError(validErrorState);
        return true;
    }

    const isNumberValid = (numberValue: number): boolean => {
        if (numberValue < 1 || numberValue > 15) {
            setNumberError({
                valid: false,
                errorText: 'Value must be between 1 and 15'
            });

            return false;
        }

        setNumberError(validErrorState);
        return true;
    }

    const handleSave = (): void => {
        if (isNameValid() && isMaxValid(max, min) && isMinValid(min, max) && isNumberValid(number)) {
            onSave({
                name,
                max,
                min,
                number,
            });
        }
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setName(event.target.value);
    }

    const handleMaxValueChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const newMax = +event.target.value;
        setMax(newMax);
        if (isMaxValid(newMax, min)) {
            isMinValid(min, newMax);
        }
    }

    const handleMinValueChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const newMin = +event.target.value;
        setMin(newMin);
        if (isMinValid(newMin, max)) {
            isMaxValid(max, newMin);
        };
    }

    const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const newNumber = +event.target.value
        setNumber(newNumber);
        isNumberValid(newNumber);
    }

    const renderTitle = () => {
        if (factory) {
            return (<Grid item>
                <DialogContentText>
                    Edit deails of factory { factory.name }.  All nodes will be regenerated.
                </DialogContentText>
            </Grid>)
        } else {
            return (<Grid item>
                <DialogContentText>
                    Add a factory.
                </DialogContentText>
            </Grid>)
        }
    }

    return (
        <Dialog fullWidth={true} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Edit Factory</DialogTitle>
            <DialogContent>
                <Grid container direction="column" spacing={3}>
                    { renderTitle() }
                    <Grid item>
                        <TextField
                            id="name"
                            label="Name"
                            value={name}
                            onChange={handleNameChange}
                            error={!nameError.valid}
                            helperText={nameError.errorText}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            id="max"
                            label="Maximum Value"
                            type="number"
                            value={max}
                            onChange={handleMaxValueChange}
                            error={!maxError.valid}
                            helperText={maxError.errorText}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            id="min"
                            label="Minimum Value"
                            type="number"
                            value={min}
                            onChange={handleMinValueChange}
                            error={!minError.valid}
                            helperText={minError.errorText}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            id="number"
                            label="Number Of Nodes"
                            type="number"
                            value={number}
                            onChange={handleNumberChange}
                            error={!numberError.valid}
                            helperText={numberError.errorText}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}