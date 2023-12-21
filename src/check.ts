export async function isChromeInstalled(): Promise<boolean> {
  const command = new Deno.Command("osascript", {
    args: ["-e", 'id of app "Google Chrome"'],
    stdout: "piped", // Capture stdout
    stderr: "piped", // Capture stderr
  });

  // Execute the command and get the output
  const output = await command.output();
  const outStr = new TextDecoder().decode(output.stdout);

  return outStr.includes("com.google.Chrome");
}
