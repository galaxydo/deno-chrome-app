import * as embedder from "https://deno.land/x/gembedder@dec21-patch-1/mod.ts"

const options = {
  importMeta: import.meta,
  mappings: [
    {
      sourceDir: "./static-assets",
      destDir: "./embedded-assets"
    }
  ]
}

if (import.meta.main) {
  await embedder.main({ options })
}
