import React, { useState, useContext } from "react";
import MapDisplay from "./MapDisplay";
import Data from "./Data";
import { SearchContext } from "./SearchContext";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

import Drawer from "@material-ui/core/Drawer";
import TextField from "@material-ui/core/TextField";
import Slider from "@material-ui/core/Slider";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

const drawerWidth = 240;


const ColorButton = withStyles((theme) => ({
  root: {
    color: ("#ffffff"),
    backgroundColor: "#424242",
    "&:hover": {
      backgroundColor: "#0ff",
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    // padding: theme.spacing(3),
  },
}));

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

export default function PermanentDrawerLeft() {
  const classes = useStyles();
  let count;
  const { search, setSearch } = useContext(SearchContext);

  const [quakeCount, setQuakeCount] = useState(0);
  const [fromDate, setFromDate] = useState("2020-08-01");
  const [toDate, setToDate] = useState("2020-08-02");
  const [minMag, setMinmag] = useState("5");


  let handleFromDate = e => {
    console.log(e.target.value);
    setFromDate(e.target.value);
    // setSearch({...search, from: e.target.value})
  };
  let handleToDate = e => {
    console.log(e.target.value);    
    setToDate(e.target.value);
    // setSearch({ ...search, to: e.target.value });
  };
  let handleMinMag = (e, newVal) => {
    // console.log(newVal);
    setMinmag(newVal);
    // setSearch({ ...search, mag: newVal });
  }
  let sendValues = () => {
    setSearch({ from: fromDate, to: toDate, mag: minMag });
  }




  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          {/* <Toolbar>
          <Typography variant="h6" noWrap>
            Permanent drawer
          </Typography>
        </Toolbar> */}
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          anchor="left"
        >
          <div className={classes.toolbar} />
          <Divider />
          <p>Total: {quakeCount} earthquakes</p>
          <p>
            val: {search.from} and {search.to}. Mag: {search.mag}
          </p>
          <form className={classes.container} noValidate>
            <TextField
              id="fromDate"
              label="From:"
              type="date"
              defaultValue="2020-05-24"
              value={fromDate}
              onChange={handleFromDate}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="toDate"
              label="To: "
              type="date"
              defaultValue="2020-05-24"
              value={toDate}
              onChange={handleToDate}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Slider
              defaultValue={3}
              aria-labelledby="discrete-slider-small-steps"
              step={0.5}
              marks
              min={0}
              max={10}
              valueLabelDisplay="auto"
              value={minMag}
              onChange={handleMinMag}
            />
          </form>
          {/* <Data /> */}
          <ColorButton
            variant="contained"
            color="primary"
            className={classes.margin}
            onClick={sendValues}
          >
            Search
          </ColorButton>
          <Divider />
          <List>
            {["Europe", "Asia", "Americas", "Africa"].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {["Reset", "Settings"].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <main className={classes.content}>
          <MapDisplay
            quakeCountMeth={() => {
              setQuakeCount(count);
            }}
          />
        </main>
      </div>
    </ThemeProvider>
  );
}
