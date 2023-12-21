import { app } from "./server.ts";
import { startBrowser } from "./browser.ts";

app.addEventListener("listen", ({ hostname, port, secure }) => {
  startBrowser(port);
});