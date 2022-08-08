"use strict";
var container = document.getElementById("container");
if (container) {
  container.onclick = (e) => {
    if (e.target.getAttribute("class") === "share") e.preventDefault();
  }
}
