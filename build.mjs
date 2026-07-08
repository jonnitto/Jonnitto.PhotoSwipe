import esbuild from "esbuild";

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");

const baseOptions = {
    logLevel: "info",
    bundle: true,
    minify: production,
    sourcemap: !production,
    target: "es2020",
    legalComments: "linked",
    entryPoints: ["Resources/Private/Assets/*.js"],
};

const scriptOptions = { ...baseOptions, outdir: "Resources/Public/Scripts", format: "iife" };

const moduleOptions = { ...baseOptions, outdir: "Resources/Public/Modules", format: "esm", splitting: true };

async function watchFunc(options) {
    const context = await esbuild.context(options);
    await context.watch();
}

if (watch) {
    watchFunc(scriptOptions);
    watchFunc(moduleOptions);
} else {
    esbuild.build(scriptOptions);
    esbuild.build(moduleOptions);
}
