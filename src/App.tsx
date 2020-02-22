import React, { useEffect, useState } from 'react';
import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import TreeComponent from "./TreeComponent";
import { createMuiTheme, MuiThemeProvider, makeStyles, Theme, createStyles, Grid, Button } from '@material-ui/core';
import { getAllTrees } from './api/getAllTrees';
import { TreeResponse } from './api/responses';
import io from 'socket.io-client';
import SocketContext from './SocketContext';
import AddIcon from '@material-ui/icons/Add';
import { addTree } from './api/addTree';

const appTheme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          backgroundColor: '#FAF9F9',
        },
      },
    },
  },
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tree: {
        margin: theme.spacing(2,0),
    },
  }),
);

const socket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000');

function App() {
  const classes = useStyles();

  const [trees, setTrees] = useState<TreeResponse[]>([]);

  const fetchTrees = async () => {
    const allTrees = await getAllTrees();
    setTrees(allTrees);
  }

  useEffect(() => {
    fetchTrees();
  }, []);

  const renderTreeComponents = () => (
    trees.map((tree: TreeResponse) => (
      <div key={tree.id} className={classes.tree}>
        <TreeComponent tree={tree} />
      </div>
    ))
  );

  const handleAddTree = async () => {
    const tree = await addTree({ name: 'Root', factories: []});
    const newTrees = [...trees, tree];
    setTrees(newTrees);
  }

  return (
    <MuiThemeProvider theme={appTheme}>
      <CssBaseline/>
      <SocketContext.Provider value={socket}>
        <Container maxWidth="lg">
          <Grid
              container
              direction="column"
              alignItems="stretch"
          >
            <Grid item>
            { renderTreeComponents() }
            </Grid>
            <Grid item>
              <Button
                  variant="contained"
                  color="primary"
                  endIcon={<AddIcon />}
                  onClick={handleAddTree}
              >
                  Add Tree
              </Button>
            </Grid>
          </Grid>
        </Container>
      </SocketContext.Provider>
    </MuiThemeProvider>
  );
}

export default App;
