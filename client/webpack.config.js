const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const sourcePath = path.join(__dirname, './src');
const distPath = path.join(__dirname, './dist');

module.exports = function config(env = {}) {
    const isProd = !!env.prod;
    const publicPath = !isProd ? 'http://localhost:3000/' : '/';

    const plugins = isProd ? [new MiniCssExtractPlugin()] : undefined;
    const stylesLoader = isProd ? MiniCssExtractPlugin.loader : 'style-loader';

    const optimization = isProd ? {
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
            }),
            new OptimizeCSSAssetsPlugin(),
        ],
    } : undefined;

    return {
        plugins,
        context: sourcePath,
        devtool: isProd ? false : 'cheap-module-source-map',
        entry: 'index.js',
        mode: isProd ? 'production' : 'development',
        optimization,
        output: {
            filename: '[name].bundle.js',
            library: 'VkTestDropdown',
            libraryExport: 'default',
            libraryTarget: 'umd',
            path: distPath,
            publicPath,
            umdNamedDefine: true,
        },
        module: {
            rules: [{
                oneOf: [
                    {
                        test: /\.(png|jpg|gif)$/i,
                        use: [{
                            loader: 'url-loader',
                            options: {
                                limit: 8192,
                            },
                        }],
                    },
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
                            stylesLoader,
                            'css-loader?modules&camelCase&localIdentName=[name]__[local]--[hash:base64:5]',
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
                modules: false,
            },
        },
    };
};
