import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import ReactDOM from "react-dom";
import ReactTooltip from "react-tooltip";
import MapChart from "./components/MapChart";
function App() {
  const [content, setContent] = useState("");
  return (
    <div>
      <MapChart setTooltipContent={setContent} />
      <div>{content}</div>
    </div>
  );
}

export default App;
