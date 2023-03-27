const postCssPlugin = require('esbuild-style-plugin');

const drop = ['debugger'];

if (!process.argv.includes('--watch')) {
    drop.push('console');
}

const sharedConfig = {
    entryPoints: ["src/resources/spargo.ts", "src/resources/style.css"],
    drop,
    treeShaking: true,
};

if (process.argv.includes('--watch')) {
    sharedConfig.sourcemap = true;
}

build({
    ...sharedConfig,
    outdir: "public",
    bundle: true,
    platform: 'browser',
    plugins: [
        postCssPlugin({
            postcss: {
                plugins: [require('tailwindcss'), require('autoprefixer')],
            },
        }),
    ],
});

async function build(options) {
    try {
        if (process.argv.includes('--watch')) {
            const ctx = await require('esbuild').context({
                ...options,
            });

            return await ctx.watch();
        } else {
            return await require('esbuild').build({
                ...options,
            });
        }
    } catch (error) {
        console.error(`Build error: ${error}`);

        return process.exit(1);
    }
}