"use strict";
window.addEventListener("DOMContentLoaded", () => {
  console.log(process.env.VITE_DEV_SERVER_URL);
  console.log("run");
  console.log(document.getElementById("root"));
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element)
      element.innerText = text;
  };
  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});
