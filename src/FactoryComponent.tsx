import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import NodeComponent from './NodeComponent';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import EditIcon from '@material-ui/icons/Edit';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { FactoryResponse } from './api/responses';
import IconButton from '@material-ui/core/IconButton';
import FactoryDialog from './FactoryDialog';
import { updateFactory } from './api/updateFactory';
import { deleteFactory } from './api/deleteFactory';
import { FactoryRequest } from './api/requests';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    node: {
        margin: theme.spacing(1,1,1,8),
    },
    gridHeader: {
        borderBottom: 5,
        borderBottomColor: '#000000',
    },
    button: {
        margin: theme.spacing(1),
    }
  }),
);

type FactoryComponentProps = {
    factory: FactoryResponse;
};

export default function FactoryComponent({ factory }: FactoryComponentProps) {
    const classes = useStyles();

    const [showEditFactoryDialog, setShowEditFactoryDialog] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const handleEditFactory = () => {
        setShowEditFactoryDialog(true);
    }

    const handleCloseEditFactoryDialog = () => {
        setShowEditFactoryDialog(false);
    }

    const handleSaveFactory = async (request: FactoryRequest) => {
        updateFactory(factory.id, request);
        handleCloseEditFactoryDialog();
    }

    const handleDeleteFactory = async () => {
        deleteFactory(factory.id);
    }

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    }

    function GridHeader() {
        return (
            <Grid container alignItems="center" justify="center" spacing={2}>
                <Grid item>
                    <IconButton onClick={toggleCollapsed}>
                        {
                            collapsed ?
                                <KeyboardArrowDownIcon fontSize="large" />
                                :
                                <KeyboardArrowUpIcon fontSize="large" />
                        }
                    </IconButton>
                </Grid>
                <Grid item>
                    <Typography variant="h6">
                        { factory.name }
                    </Typography>
                </Grid>
                <Grid item>
                    <Chip label={`${factory.min}:${factory.max}`} />
                </Grid>
                <Grid item xs>
                    <Grid container alignItems="flex-start" justify="flex-end" direction="row">
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                endIcon={<EditIcon />}
                                onClick={handleEditFactory}
                            >
                                Edit Factory
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                endIcon={<DeleteSweepIcon />}
                                onClick={handleDeleteFactory}
                            >
                                Delete Factory
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }

    function GridValues() {
        return (
            <>
                {
                    factory.values.map((value: number, index: number) => (
                        <Grid key={index} item className={classes.node}>
                            <NodeComponent value={value} />
                        </Grid>
                    ))
                }
            </>
        );
    }

    return (
        <Grid
            container
            direction="column"
            justify="center"
            alignItems="stretch"
        >
            <Grid item className={classes.gridHeader}>
                <GridHeader />
            </Grid>
            <Collapse in={!collapsed}>
                <GridValues />
            </Collapse>
            <FactoryDialog
                factory={factory}
                onClose={handleCloseEditFactoryDialog}
                onSave={handleSaveFactory}
                open={showEditFactoryDialog}
            />
        </Grid>
    );
}