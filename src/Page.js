import React, { useState, useContext, useEffect, useRef } from "react";
import MapDisplay from "./MapDisplay";
import InputSlider from "./Slider";
import Data from "./Data";
import { SearchContext } from "./SearchContext";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
// import getMuiTheme from "@material-ui/styles/getMuiTheme";
import { MuiThemeProvider } from "@material-ui/core/styles";

import Drawer from "@material-ui/core/Drawer";
import TextField from "@material-ui/core/TextField";
import Slider from "@material-ui/core/Slider";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";

import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import AccessTimeIcon from "@material-ui/icons/AccessTime";

var drawerWidth = 180;
if (window.innerWidth > 500) {
  drawerWidth = 300;
}

// const setDrawer = (dw) => {
//   drawerWidth = dw;
//   console.log(drawerWidth);
// };

const ColorButton = withStyles((theme) => ({
  root: {
    color: "#ffffff",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  button: {
    background: "#f1f1f1",
    "&:hover": {
      background: "#f00",
    },
  },
  root: {
    display: "flex",
  },
  appBar: {
    marginRight: 0,
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
  slider: {
    color: "white",
  },
  itemText: {
    fontSize: "0.5em",
  },
}));

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

const theme2 = createMuiTheme({
  slider: {
    selectionColor: "swags",
    trackSize: 30,
  },
  root: {
    width: 250,
  },
  input: {
    width: 42,
  },
});

export default function PermanentDrawerLeft() {
  const classes = useStyles();
  let count;

  var todayDate = new Date().toISOString().slice(0, 10);

  const yesterday = new Date(new Date());
  yesterday.setDate(yesterday.getDate() - 1);
  let ytdDate = yesterday.toISOString().slice(0, 10);

  const [search, setSearch] = useState({
    from: ytdDate,
    to: todayDate,
    mag: "4",
  });

  const [quakeCount, setQuakeCount] = useState(0);
  const [fromDate, setFromDate] = useState(search.from);
  const [toDate, setToDate] = useState(search.to);
  const [minMag, setMinmag] = useState(search.mag);
  const [open, setOpen] = useState(true);
  const optionsShow = useRef(null);

  const [value, setValue] = React.useState(4);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 10) {
      setValue(10);
    }
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === "" ? "" : Number(event.target.value));
  };

  let handleFromDate = (e) => {
    setFromDate(e.target.value);
  };
  let handleToDate = (e) => {
    setToDate(e.target.value);
  };
  let handleMinMag = (newVal) => {
    setMinmag(newVal);
  };
  let sendValues = (e) => {
    e.preventDefault();
    setLoaded(false);
    setSearch({ from: fromDate, to: toDate, mag: minMag });
  };

  const [response, setResponse] = useState();
  const [loaded, setLoaded] = useState(false);
  // const { search, setSearch } = useContext(SearchContext);
  useEffect(() => {
    if (search) {
      setLoaded(false);
      // console.log(search);
      (async () => {
        let data = await fetch(
          `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${search.from}&endtime=${search.to}&minmagnitude=${search.mag}`
        );
        let body = await data.json();
        setResponse(body.features);
        setLoaded(true);
      })();
    }
  }, [search]);

  useEffect(() => {
    if (response) {
      // console.log(response);
      setQuakeCount(response.length);
    }
  }, [response]);

  const [valReset, setValReset] = useState();
  const pastDay = (e) => {
    e.preventDefault();
    setSearch({
      from: ytdDate,
      to: todayDate,
      mag: "4",
    });
    setFromDate(ytdDate);
    setToDate(todayDate);
    setMinmag(4);
    setValReset(true);
  };

  const [eqNumber, seteqNumber] = useState();
  const listClick = (eqNumber) => {
    // console.log("List clicked", eqNumber);
    seteqNumber(eqNumber);
  };

  return (
    <div className="full">
      <p
        ref={optionsShow}
        className="impose"
        onClick={() => {
          optionsShow.current.classList.remove("active");
          setOpen(true);
        }}
      >
        Options
      </p>

      <ThemeProvider theme={darkTheme}>
        <div className={classes.root}>
          <CssBaseline />

          <Drawer
            // className={classes.drawer}
            open={open}
            variant="persistent"
            classes={{
              paper: classes.drawerPaper,
            }}
            anchor="left"
          >
            <p className="title">Earthquake Finder</p>
            <p
              className="minimise"
              onClick={() => {
                optionsShow.current.classList.add("active");
                console.log(optionsShow.current.classList);
                setOpen(false);
              }}
            >
              Hide Options
            </p>
            <Divider />
            <p className="criteria">Search criteria:</p>
            <form className="inputs" noValidate>
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
              <div className="slider">
                Minimum magnitude:
                <InputSlider
                  handleMinMag={handleMinMag}
                  valReset={valReset}
                  setValReset={setValReset}
                />
                <button onClick={sendValues}>Search</button>
              </div>
            </form>
            <Divider />
            <List>
              <ListItem button key="day" onClick={pastDay}>
                <ListItemIcon>{<AccessTimeIcon />}</ListItemIcon>
                <ListItemText primary="Reset to past 24 hours" />
              </ListItem>
            </List>
            <Divider />
            <p>Total: {quakeCount} earthquakes</p>

            <List>
              {loaded ? (
                response.map((eq, idx) => (
                  <ListItem
                    button
                    onClick={() => {
                      // console.log("list");
                      listClick(idx);
                    }}
                    key={eq.id}
                  >
                    <ListItemText
                      className={classes.itemText}
                      primary={`Mag ${eq.properties.mag}, ${eq.properties.place}`}
                      secondary={
                        new Date(eq.properties.time).toLocaleString("en-GB", {
                          timeZone: "UTC",
                        }) + " UTC"
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <p>Loading...</p>
              )}
            </List>
          </Drawer>

          <main className={classes.content}>
            <MapDisplay
              quakeCountMeth={() => {
                setQuakeCount(count);
              }}
              response={response}
              loaded={loaded}
              search={search}
              eqNumber={eqNumber}
              // closePopup={() => {
              //   inputRef.current[eqNumber].leafletElement.closePopup();
              // }}
            />
          </main>
        </div>
      </ThemeProvider>
    </div>
  );
}
