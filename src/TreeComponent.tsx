import React, { useState, useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import FactoryComponent from './FactoryComponent';
import Grid from '@material-ui/core/Grid';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TreeResponse, AddFactoryResponse, DeleteFactoryResponse } from './api/responses';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import FactoryDialog from './FactoryDialog';
import { FactoryRequest } from './api/requests';
import { addFactory } from './api/addFactory';
import Button from '@material-ui/core/Button';
import { Collapse } from '@material-ui/core';
import SocketContext from './SocketContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    factory: {
        margin: theme.spacing(1,1,1,8),
    },
    emptyFactory: {
        textAlign: "center",
    },
    treeHeader: {
        backgroundColor: '#b2ebf2',
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        padding: theme.spacing(1,3),
    },
    treeContent: {
        backgroundColor: '#D1F9FF',
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
    },
    treeIcon: {
        padding: theme.spacing(0,2),
    },
    treeTitle: {
        padding: theme.spacing(0,2)
    },
    button: {
        margin: theme.spacing(1),
    }
  }),
);

type TreeComponentProps = {
    tree: TreeResponse;
}

export default function TreeComponent({ tree }: TreeComponentProps) {
    const classes = useStyles();

    const socket = useContext(SocketContext);

    const [factories, setFactories] = useState(tree.factories);
    const [showAddFactoryDialog, setShowAddFactoryDialog] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    socket.on('ADD_FACTORY', (response: AddFactoryResponse) => {
        if (response.treeId === tree.id) {
            if (!factories.some(factory => factory.id === response.factory.id)) {
                setFactories([...factories, response.factory]);
            }
        }
    });

    socket.on('DELETE_FACTORY', (response: DeleteFactoryResponse) => {
        if (tree.id === response.treeId) {
            const factoryIndex = factories.findIndex(factory => factory.id === response.factoryId);

            const newFactories = [...factories];
            newFactories.splice(factoryIndex, 1);

            setFactories(newFactories);
        }
    });

    const renderFactoryComponents = () => (
        // tree.factories.map(factory => <FactoryComponent key={factory.id} factory={factory} />)
        factories.map(factory => <FactoryComponent key={factory.id} factory={factory} />)
    );

    const handleAddFactory = () => {
        setShowAddFactoryDialog(true);
    }

    const handleCloseAddFactoryDialog = () => {
        setShowAddFactoryDialog(false);
    }

    const handleSaveFactory = async (request: FactoryRequest) => {
        await addFactory(tree.id, request);
        handleCloseAddFactoryDialog();
    }

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    }

    function FactoryComponents() {
        if (factories.length > 0) {
            return (
                <div className={classes.factory}>
                    { renderFactoryComponents() }
                </div>
            )
        } else {
            return (
                <div className={classes.emptyFactory}>
                    <Typography variant="h6">
                        No factories
                    </Typography>
                </div>
            )
        }
    }

    return (
        <Grid
            container
            direction="column"
            alignItems="stretch"
        >
            <Grid item xl className={classes.treeHeader}>
                <Grid
                    container
                    direction="row"
                    alignItems="center"
                >
                    <Grid item className={classes.treeIcon}>
                        <IconButton onClick={toggleCollapse}>
                            {
                                collapsed ?
                                    <KeyboardArrowDownIcon fontSize="large" />
                                    :
                                    <KeyboardArrowUpIcon fontSize="large" />
                            }
                        </IconButton>
                    </Grid>
                    <Grid item className={classes.treeTitle}>
                        <Typography variant="h4">
                            { tree.name }
                        </Typography>
                    </Grid>
                    <Grid item xs>
                        <Grid container alignItems="flex-start" justify="flex-end" direction="row">
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                endIcon={<AddIcon />}
                                onClick={handleAddFactory}
                            >
                                Add Factory
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xl className={classes.treeContent}>
                <Collapse in={!collapsed}>
                    <FactoryComponents />
                </Collapse>
            </Grid>

            <FactoryDialog
                onClose={handleCloseAddFactoryDialog}
                onSave={handleSaveFactory}
                open={showAddFactoryDialog}
            />
        </Grid>
    );
}