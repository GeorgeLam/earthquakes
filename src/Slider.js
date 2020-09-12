import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";
import VolumeUp from "@material-ui/icons/VolumeUp";

const useStyles = makeStyles({
  input: {
    width: 27,
  },
  slider: {
    color: "white",
  },
});

export default function InputSlider({ handleMinMag, valReset, setValReset }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(4);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (valReset) {
      setValue(4);
      setValReset(false);
    }
  }, [valReset]);

  const handleInputChange = (event) => {
    setValue(event.target.value === "" ? "" : Number(event.target.value));
  };

  useEffect(() => {
    console.log(value);
    handleMinMag(value);
  }, [value]);

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 10) {
      setValue(10);
    }
  };

  return (
    <div>
      <Grid container spacing={2} alignItems="center">
        <Grid item></Grid>
        <Grid item xs>
          <Slider
            label="Minimum"
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
            className={classes.input}
            value={value}
            margin="dense"
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
        </Grid>
      </Grid>
    </div>
  );
}
