import React, { useState } from "react";
import './App.css';
import axios from "axios";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [jsonData, setJsonData ] = useState(null);
  const [url, setUrl] = useState(null);
  const [heading, setHeading] = useState("Upfit");
  const [processing, setProcessing] = useState(false);

  const switchUpfit = (event) => {
    event.preventDefault();
    setHeading("Upfit");
    setJsonData(null);
    setUrl(null)
    setQuery("");
  }

  const switchFloorplan = (event) => {
    event.preventDefault();
    setHeading("Floorplan");
    setUrl(null);
    setJsonData(null);
    setQuery("");
  }

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const fetchData = async (query) => {
    try {
      if(heading === "Upfit"){
        const response = await axios.get(`http://3.94.54.48:8000/image-classify/?query-parameter=${query}`);
        console.log(response.data)
        setUrl(query);
        setJsonData(JSON.parse(response.data));
        setProcessing(false);
      }
      if(heading === "Floorplan"){
        const response = await axios.get(`http://3.94.54.48:8000/floorplan-classify/?query-parameter=${query}`);
        console.log(response.data)
        setUrl(query);
        setJsonData(JSON.parse(response.data));
        setProcessing(false);
      }
      
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`Search query: ${query}`);
    if(query){
      fetchData(query); 
      setProcessing(true);
      setUrl(null);
      setJsonData(null);
    }else{
      alert("Search for something");
    }
    // setQuery("");
  };

  return (
    <div className="page">
      <div className="switcher-header">
        <div className="switcher">
          <div className="switcher-button" onClick={switchUpfit} id="Upfit">Upfit</div>
          <div className="switcher-button" onClick={switchFloorplan} id="FloorPlan">FloorPlan</div>
        </div>
        <h2>{heading} Classification</h2>
      </div>
      <form className="search-bar" onSubmit={handleSubmit}>
        <input type="text" value={query} onChange={handleInputChange} placeholder="Enter Image URL here ..." className="search-input"/>
        <button type="submit" className="search-button">Classify</button>
      </form>
      {processing && <div>Processing ...</div>}
      <div className="image-json">
        {/* { <div>Please wait</div>} */}
        {url && <img src={url}></img>}
        <div className='display-area'>
          {jsonData && <div className='display-box'>
            { 
              Object.keys(jsonData).map((key,i) =>{
                if(heading === "Upfit"){
                  return (<p key={i}>
                    <span className='display-key'>{key === "class" ? "Upfit Type" : "Model Confidence"}: </span>
                    <span>{jsonData[key]}</span>
                  </p>)
                }
                if(heading === "Floorplan"){
                  return (<p key={i}>
                    <span className='display-key'>{key === "class" ? "Floorplan Type" : "Model Confidence"}: </span>
                    <span>{jsonData[key]}</span>
                  </p>)
                }
              })
            }
          </div>}
        </div>
      </div>
    </div>
    
  );
}

export default SearchBar;