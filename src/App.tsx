import { useState, useEffect } from "react";
import "./App.css";
function App() {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);

    if (element) element.innerText = text;
  };

  useEffect(() => {
    for (const dependency of ["chrome", "node", "electron"]) {
      replaceText(`${dependency}-version`, navigator.userAgent);
    }
  }, []);

  return (
    <>
      <h1>Hello World!</h1>
      We are using Node.js <span id="node-version"></span>, Chromium{" "}
      <span id="chrome-version"></span>, and Electron{" "}
      <span id="electron-version"></span>.
    </>
  );
}

export default App;
