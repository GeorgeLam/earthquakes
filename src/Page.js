import React, { useState, useEffect, useRef } from "react";
import MapDisplay from "./MapDisplay";
import InputSlider from "./Slider";

import { makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import TextField from "@material-ui/core/TextField";
import CssBaseline from "@material-ui/core/CssBaseline";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AccessTimeIcon from "@material-ui/icons/AccessTime";

// var drawerWidth = 180;
// if (window.innerWidth > 500) {
//   drawerWidth = 300;
// }
let drawerWidth;
window.innerWidth > 500 ? (drawerWidth = 250) : (drawerWidth = 185);

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

export default function PermanentDrawerLeft() {
  const classes = useStyles();
  let count;

  //Upon load, map autoloads quakes from the past day
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
  const [eqNumber, seteqNumber] = useState();

  useEffect(() => {
    if (search) {
      setLoaded(false);
      seteqNumber(null);
      //eqNumber is passed to mapDisplay to determine which map popup opens. Upon new search, it's nullified to close any open popup.
      (async () => {
        let data = await fetch(
          `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${search.from}&endtime=${search.to}&minmagnitude=${search.mag}`
        );
        let body = await data.json();
        setQuakeCount(body.features.length);
        setResponse(body.features);
        setLoaded(true);
      })();
    }
  }, [search]);

  //For the 'past 24 hours' reset button:
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

  const listClick = (eqNumber) => {
    seteqNumber(eqNumber);
  };

  return (
    <div className="full">
      <p
        ref={optionsShow}
        className="optionsToggle"
        onClick={() => {
          setOpen(!open);
        }}
      >
        Toggle Options
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
            <p className="subtitle">
              by{" "}
              <a
                href="https://georgelam.dev"
                target="_blank"
                rel="noopener noreferrer"
              >
                George Lam
              </a>
            </p>

            <Divider />
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
              <ListItem button key="day" onClick={pastDay} dense>
                <ListItemIcon>{<AccessTimeIcon />}</ListItemIcon>
                <ListItemText primary="Reset to past 24 hours" />
              </ListItem>
            </List>
            <Divider />
            <p className="totalEQ">Total: {quakeCount} earthquakes</p>

            <List>
              {loaded ? (
                response.map((eq, idx) => (
                  <ListItem
                    button
                    dense
                    onClick={() => {
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
            />
          </main>
        </div>
      </ThemeProvider>
    </div>
  );
}
