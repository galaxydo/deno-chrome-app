# Deno Chrome App

This example project demonstrates building desktop app using Deno server and Web frontend.

[Deno Standard GUI](https://github.com/denoland/deno/discussions/3234)

[Deno WebUI](https://github.com/webui-dev/deno-webui)

### Getting Started

1. **Prepare your frontend assets**

   Place your frontend files, including the `index.html`, into the `static-assets` directory.

2. **Generate embedded-assets TypeScript files**

   We need to convert the static assets into TypeScript files that can be embedded into the Deno binary at compile time. Run the command below from the project's root directory:

   ```shell
   deno run --unstable --allow-all ./embedder.ts build
   ```

3. **Compile the Deno application**

    Compile your application into an executable binary using the following command:

   ```shell
    deno compile --output deno-chrome-example --allow-read --allow-net src/main.ts
   ```

4. **Deploy the application**

    After compiling the application, you can transfer the deno-chrome-example binary to another system. Running the binary will open a full-screen Chrome window displaying your index.html.