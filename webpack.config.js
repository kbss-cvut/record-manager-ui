const dotenv = require('dotenv').config();
const { resolve } = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const apiUrl = process.env.RECORD_MANAGER_API_URL;
const appTitle = process.env.RECORD_MANAGER_APP_TITLE;
const devServerPort = process.env.RECORD_MANAGER_DEV_SERVER_PORT;

console.log('RECORD_MANAGER_API_URL =', apiUrl);

module.exports = (env = {}) => {
    const isStatic = process.env.STATIC;
    const isForceBasename = process.env.FORCE_BASENAME;
    let basename = process.env.RECORD_MANAGER_BASENAME || '';
    if (basename.charAt(basename.length - 1) === '/') {
        basename = basename.substring(0, basename.length - 1);
    }
    const version = process.env.npm_package_version;
    const appInfo = process.env.RECORD_MANAGER_APP_INFO;

    return {
        mode: env.production ? 'production' : 'development',
        context: resolve('src'),
        entry: ['core-js/stable/object/assign', 'core-js/stable/promise', './index.jsx'],
        output: {
            filename: env.production ? 'bundle.[name].[contenthash].js' : 'bundle.[name].js',
            chunkFilename: '[name].[contenthash].js',
            path: isStatic ? resolve(`../../../target/record-manager-${version}/`) : resolve('build/'),
            publicPath: (isStatic || isForceBasename) ? `${basename}/` : '',
        },
        resolve: {
            extensions: ['.js', '.jsx', '.json'],
            alias: {
                // Provide an alias for the problematic import
                'react-bootstrap/Card': resolve(__dirname, 'node_modules/react-bootstrap/esm/Card.js'),
            },
            fallback: {
                url: false,
                "querystring": require.resolve("querystring-es3")
            }
        },
        devServer: {
            host: 'localhost',
            port: devServerPort || 8080,
            historyApiFallback: true,
            static: {
                directory: resolve('build'),
                publicPath: '/',
            },
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
                    test: /\.(js|jsx)$/,
                    include: /node_modules[\/\\]intelligent-tree-select/,
                    use: ['babel-loader'],
                },

                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        env.production ? cssnano({ preset: 'default' }) : cssnano({ discardComments: { removeAll: true } }),
                                        autoprefixer(),
                                    ],
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                        },
                    ],
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'fonts/'
                            }
                        }
                    ]
                }
            ],
        },
        stats: {
            colors: true,
            reasons: true,
            chunks: false,
            modules: false,
        },
        plugins: [

            new HtmlWebpackPlugin({
                version: env.production ? version : 'Dev',
                year: new Date().getFullYear(),
                title: appTitle,
                template: resolve(__dirname, 'public/index.html'),
                favicon: resolve(__dirname, 'public/favicon.ico'),
                inject: true,
                minify: env.production,
                basename: (isStatic || isForceBasename) ? basename : '',
                appInfo: appInfo,
            }),

            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(env.production ? 'production' : 'development'),
                    NPM_PACKAGE_VERSION: JSON.stringify(process.env.npm_package_version),
                    // Load env vars from .env file
                    ...Object.keys(dotenv.parsed || {}).reduce((acc, key) => {
                        return { ...acc, [key]: JSON.stringify(dotenv.parsed[key]) };
                    }, {}),
                    // Load env vars from shell - but only those that start with RECORD_MANAGER_
                    ...Object.keys(process.env).filter(key => key.startsWith('RECORD_MANAGER_')).reduce((env, key) => {
                        env[key] = JSON.stringify(process.env[key]);
                        return env;
                    }, {}),
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
                        from: resolve('./public'),
                    },
                ],
                { copyUnmodified: true },
            ),
        ],
    };
};
