const path = require('path');

const sourcePath = path.join(__dirname, './src');
const distPath = path.join(__dirname, './dist');

module.exports = function config(env = {}) {
    const isProd = !!env.prod;
    const publicPath = !isProd ? 'http://localhost:3000/' : '/';

    return {
        context: sourcePath,
        devtool: isProd ? false : 'cheap-module-source-map',
        entry: 'index.js',
        mode: isProd ? 'production' : 'development',
        output: {
            publicPath,
            path: distPath,
            filename: '[name].bundle.js',
        },
        module: {
            rules: [{
                oneOf: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: [
                            'babel-loader',
                            'eslint-loader',
                        ],
                    },
                    {
                        test: /\.css$/,
                        exclude: /node_modules/,
                        use: [
                            'style-loader',
                            'css-loader?modules&camelCase&importLoaders=1&localIdentName=[path][name]__[local]--[hash:base64:5]',
                        ],
                    },
                    {
                        loader: 'file-loader',
                        // Exclude `js` files to keep "css" loader working as it injects
                        // it's runtime that would otherwise processed through "file" loader.
                        // Also exclude `html` and `json` extensions so they get processed
                        // by webpacks internal loaders.
                        exclude: [/\.js$/, /\.html$/, /\.json$/],
                        options: {
                            publicPath,
                            name: 'media/[name].[hash:8].[ext]',
                        },
                    },
                ],
            }],
        },
        resolve: {
            modules: [
                path.resolve(__dirname, 'node_modules'),
                sourcePath,
            ],
        },

        devServer: {
            contentBase: './src',
            port: 3000,
            headers: { 'Access-Control-Allow-Origin': '*' },
            hot: true,
            stats: {
                // assets: true,
                // children: false,
                // chunks: false,
                // hash: false,
                modules: false,
                // publicPath: false,
                // timings: true,
                // version: false,
                // warnings: true,
                // colors: {
                //     green: '\u001b[32m',
                // }
            },
        },
    };
};
