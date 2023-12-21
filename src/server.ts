import { Application } from "https://deno.land/x/oak@v12.6.1/mod.ts";

import { filesMap } from "./assets.ts";

const app = new Application();

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

function getContentType(pathname: string) {
  const extension = pathname.split(".").pop();
  switch (extension) {
    case "html":
      return "text/html";
    case "css":
      return "text/css";
    case "js":
      return "text/javascript";
    case "json":
      return "application/json";
    case "woff":
    case "woff2":
      return "font/woff2"; // WOFF2 can cover both .woff and .woff2
    case "txt":
      return "text/plain";
    // Add more cases for other file types as needed.
    default:
      return "application/octet-stream";
  }
}

app.use(async (ctx) => {
  try {
    let pathname = ctx.request.url.pathname;
    // Normalize the pathname to remove the leading slash
    if (pathname.startsWith("/")) {
      pathname = pathname.substring(1);
    }
    if (pathname === "") {
      pathname = "index.html"; // Serve 'index.html' for the root
    }
    if (filesMap.has(pathname)) {
      const fileContent = filesMap.get(pathname);
      ctx.response.status = 200; // OK
      ctx.response.headers.set("Content-Type", getContentType(pathname));
      ctx.response.body = fileContent;
    } else {
      ctx.response.status = 404; // Not Found
      ctx.response.body = `Not found: ${pathname}`;
    }
  } catch (error) {
    ctx.response.status = 500; // Internal Server Error
    ctx.response.body = "An error occurred";
    console.error("Error handling request:", error);
  }
});

app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(
    `Listening on: ${secure ? "https://" : "http://"}${
      hostname ?? "localhost"
    }:${port}`,
  );
});

app.addEventListener("error", (evt) => {
  console.log(evt.error);
});

app.listen({ port: 0 });

export { app };
