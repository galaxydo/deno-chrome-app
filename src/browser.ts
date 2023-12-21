async function readStream(
  stream: ReadableStream<Uint8Array>,
  callback: (chunk: string) => void,
) {
  const decoder = new TextDecoder();
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value);
      callback(text);
    }
  } finally {
    reader.releaseLock();
  }
}

const kioskModeScript = `tell application "System Events" to keystroke "f" using {command down, control down}`;

const fullscreenCommand = new Deno.Command("osascript", {
  args: ["-e", kioskModeScript],
});

export const startBrowser = (port: number) => {
  const args = [
    "--new",
    "-a",
    "Google Chrome",
    "--args",
    "--no-first-run",
    "--no-proxy-server",
    "--safe-mode",
    "--disable-background-mode",
    "--disable-plugins",
    "--disable-plugins-discovery",
    "--disable-translate",
    "--disable-features=Translate",
    "--bwsi",
    "--disable-sync",
    "--disable-sync-preferences",
    "--disable-component-update",
    "--allow-insecure-localhost",
    `--app=http://localhost:${port}`,
  ];

  const xit = new Deno.Command("open", {
    args: args,
    stdout: "piped",
    stderr: "piped",
  });

  const ixit = xit.spawn();

  console.info("Chrome launched", {
    pid: ixit.pid,
    status: ixit.status,
  });

  readStream(ixit.stdout, (chunk) => console.log(chunk));
  readStream(ixit.stderr, (chunk) => console.error(chunk));

  setTimeout(async () => {
      console.info('Activating full-screen mode...');
      const fsxit = await fullscreenCommand.output();

      console.info('Full-screen command executed', fsxit);

      const status = await ixit.status;
      console.info("Process completed with status:", status);
  }, 1000);
}
