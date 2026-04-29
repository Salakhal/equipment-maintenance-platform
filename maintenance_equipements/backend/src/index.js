import React from "react";
import ReactDOM from "react-dom/client";

function Test() {
  return <h1 style={{color: "blue"}}>🔥 INDEX OK 🔥</h1>;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Test />);