import React, { useState, useContext, useEffect } from "react";
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

const drawerWidth = 300;

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
  slider: {
    color: "white",
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
  console.log(todayDate);

  const yesterday = new Date(new Date());
  yesterday.setDate(yesterday.getDate() - 1);

  let ytdDate = yesterday.toISOString().slice(0, 10);
  console.log(ytdDate);

  const [search, setSearch] = useState({
    from: ytdDate,
    to: todayDate,
    mag: "4",
  });

  const [quakeCount, setQuakeCount] = useState(0);
  const [fromDate, setFromDate] = useState(search.from);
  const [toDate, setToDate] = useState(search.to);
  const [minMag, setMinmag] = useState(search.mag);

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
    console.log(e.target.value);
    setFromDate(e.target.value);
    // setSearch({...search, from: e.target.value})
  };
  let handleToDate = (e) => {
    console.log(e.target.value);
    setToDate(e.target.value);
    // setSearch({ ...search, to: e.target.value });
  };
  let handleMinMag = (newVal) => {
    // console.log(newVal);
    setMinmag(newVal);
    // setSearch({ ...search, mag: newVal });
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
      console.log(search);
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
      console.log(response);
      setQuakeCount(response.length);
    }
  }, [response]);

  // props.quakeCountMeth(30);

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

  const [coord, setCoord] = useState();
  const listClick = (coords) => {
    // e.preventDefault();
    console.log("list clicked", coords);
    setCoord(coords);
  };

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
          <p className="title">Earthquake Finder</p>
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
              {/* <div className={theme2.root}>
                <ThemeProvider theme={darkTheme}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item></Grid>
                    <Grid item xs>
                      <Slider
                        value={typeof value === "number" ? value : 0}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                        min={0}
                        max={10}
                        step={0.5}
                      />
                    </Grid>
                    <Grid item>
                      <Input
                        className={theme2.input}
                        value={value}
                        margin="dense"
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                      />
                    </Grid>
                  </Grid>
                </ThemeProvider>
              </div> */}
            </div>
          </form>
          {/* <Data /> */}
          <Divider />
          <p>Total: {quakeCount} earthquakes</p>
          {/* <p>
            val: {search.from} and {search.to}. Mag: {search.mag}
          </p> */}
          <List>
            {loaded ? (
              response.map((eq, idx) => (
                <ListItem
                  button
                  onClick={() => {
                    console.log("list");
                    listClick(idx);
                  }}
                  key={eq.id}
                  // onClick={listClick([
                  //   eq.geometry.coordinates[1],
                  //   eq.geometry.coordinates[0],
                  // ])}
                >
                  {/* <ListItemIcon>
                    {1 % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon> */}
                  <ListItemText
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
          <Divider />
          <List>
            <ListItem button key="day" onClick={pastDay}>
              <ListItemIcon>{<AccessTimeIcon />}</ListItemIcon>
              <ListItemText primary="Reset to past 24 hours" />
            </ListItem>
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
            coord={coord}
          />
        </main>
      </div>
    </ThemeProvider>
  );
}
