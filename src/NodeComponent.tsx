import React from 'react';
import Typography from '@material-ui/core/Typography';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    nodeIcon: {
        margin: theme.spacing(0,1),
    },
  }),
);

type NodeComponentProps = {
    value: number;
};

export default function NodeComponent({ value }: NodeComponentProps) {
    const classes = useStyles();

    return (
        <Grid container direction="row" alignItems="center">
            <Grid item className={classes.nodeIcon}>
                <ChevronRightIcon fontSize="large" />
            </Grid>
            <Grid item>
                <Typography gutterBottom>{value}</Typography>
            </Grid>
        </Grid>
    )
}