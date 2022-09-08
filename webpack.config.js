const dotenv = require('dotenv').config()

const {resolve} = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {getIfUtils, removeEmpty} = require('webpack-config-utils');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const apiUrl = process.env.RECORD_MANAGER_API_URL;
const appTitle = process.env.RECORD_MANAGER_APP_TITLE;
const devServerPort = process.env.RECORD_MANAGER_DEV_SERVER_PORT;

console.log('RECORD_MANAGER_API_URL =', apiUrl);

module.exports = (
    env = {
        dev: true,
    },
) => {
    const {ifProd, ifNotProd} = getIfUtils(env);
    const isStatic = process.env.STATIC
    const basename = process.env.RECORD_MANAGER_BASENAME;
    const version = process.env.npm_package_version;

    return {
        mode: ifProd('production', 'development'),
        context: resolve('js'),
        entry: ['core-js/stable/object/assign', 'core-js/stable/promise', './index.js'],
        output: {
            filename: ifProd('bundle.[name].[chunkhash].js', 'bundle.[name].js'),
            chunkFilename: '[name].[chunkhash].js',
            path: isStatic ? resolve(`../../../target/record-manager-${version}/`) : resolve('build/'),
            publicPath: isStatic ? basename : "/",
        },
        resolve: {
            extensions: ['.js', '.jsx', '.json']
        },
        devServer: {
            host: '0.0.0.0',
            inline: true,
            port: devServerPort || 8080,
            historyApiFallback: true
        },
        devtool: 'source-map',
        optimization: {
            runtimeChunk: 'single',
            splitChunks: {
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'initial',
                        name: 'vendors',
                    }
                },
            },
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: ['babel-loader'],
                },

                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: 'style-loader',
                        },
                        {
                            loader: 'css-loader',
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    ifProd(cssnano({preset: 'default'}), cssnano({discardComments: {removeAll: true}})),
                                    autoprefixer(),
                                ],
                            },
                        },
                    ],
                },
            ]
        },
        stats: {
            colors: true,
            reasons: true,
            chunks: false,
            modules: false,
        },
        plugins: removeEmpty([
            new webpack.optimize.ModuleConcatenationPlugin(),
            ifNotProd(new webpack.NoEmitOnErrorsPlugin()),
            ifNotProd(new webpack.NamedModulesPlugin()),
            ifNotProd(new webpack.HotModuleReplacementPlugin()),

            new HtmlWebpackPlugin({
                version: ifProd(version, "Dev"),
                year: new Date().getFullYear(),
                title: appTitle,
                template: 'index.html',
                inject: true,
                minify: true,
                basename: isStatic ? basename : "",
            }),
            new InlineManifestWebpackPlugin(),

            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: ifProd('"production"', '"development"'),
                    NPM_PACKAGE_VERSION: JSON.stringify(process.env.npm_package_version),
                    // Load env vars from .env file
                    ...Object.keys(dotenv.parsed || {}).reduce((acc, key) => {
                        return {...acc, [key]: JSON.stringify(dotenv.parsed[key])};
                    }, {}),
                    // Load env vars from shell - but only those that start with RECORD_MANAGER_
                    ...Object.keys(process.env).filter(key => key.startsWith('RECORD_MANAGER_')).reduce((env, key) => {
                        env[key] = JSON.stringify(process.env[key])
                        return env
                    }, {})
                },
            }),

            new CleanWebpackPlugin({
                root: resolve('./'),
                verbose: true,
                dry: false,
            }),

            // Copy public directory contents to {output}
            new CopyWebpackPlugin(
                [
                    {
                        from: resolve('./resources'),
                    }
                ],
                {copyUnmodified: true},
            ),
        ])
    };
};
