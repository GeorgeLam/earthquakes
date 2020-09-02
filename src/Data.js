import React, {useState, useEffect} from 'react';

const Data = () => {
    const[response, setResponse] = useState();
    console.log("Data load")

    // useEffect(() => {(
    //     async() => {
    //         let data = await fetch("https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-09-01&endtime=2020-09-02")
    //         console.log(await data.json())
    //         let body = await data.json()
    //         setResponse(await data.json())
    //     })()
    // }, [])

    return (
        <div>
            <span>
                {/* {response} */}
            </span>
        </div>
    );
};

export default Data;