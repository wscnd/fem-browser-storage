import Menu from "./Menu.js";
import Order from "./Order.js";
import Router from "./Router.js";

window.addEventListener("DOMContentLoaded", () => {
  Router.init();
  Menu.load();
  Order.load();
  Order.render();
});

(async function () {
  if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persist().then((persistent) => {
      if (persistent) {
        console.log(
          "Storage will not be cleared except by explicit user action"
        );
      } else {
        console.log("Storage may be cleared by the UA under storage pressure.");
      }
    });
  }
})();

(async function () {
  if (navigator.storage && navigator.storage.estimate) {
    const q = await navigator.storage.estimate();
    console.log(`quota available: ${parseInt(q.quota / 1024 / 1024)}MiB`);
    console.log(`quota usage: ${q.usage / 1024}KiB`);
  }
})();
