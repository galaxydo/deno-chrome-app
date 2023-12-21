// deno-lint-ignore-file no-explicit-any
import embeddedAssets from "../embedded-assets/dir.ts";

const loadAssets = (
  assets: any,
): Promise<[string, Uint8Array | string]>[] => {
  return assets.list().map(async (fit: string) => {
    fit = fit as string;
    const afit = await assets.load(fit);
    let efit: Uint8Array | string;
    if (typeof fit == 'string' && (fit.includes(".js") || fit.includes(".html"))) {
      efit = await afit.text();
      console.log(`Loaded ${fit} as text (${efit.length} chars)`);
    } else {
      efit = await afit.bytes();
      console.log(`Loaded ${fit} as binary (${efit.length} bytes)`);
    }
    return [fit, efit];
  }) as any;
};

const files = await Promise.all([
  ...loadAssets(embeddedAssets),
]);

console.log("Loaded files:", files.length);

const filesMap = new Map<string, Uint8Array | string>();

for (const fit of files) {
  filesMap.set(fit[0] as string, fit[1] as Uint8Array | string);
}

export { filesMap };

// const index = filesMap.get('index.html');

// console.log('index', index?.toString());
