const dotenvConfig = require('dotenv-safe').config({
    allowEmptyValues: false,
    sample: './.env.example',
});


const {resolve} = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {getIfUtils, removeEmpty} = require('webpack-config-utils');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');

const apiUrl = process.env.STUDY_MANAGER_API_URL;
const appTitle = process.env.STUDY_MANAGER_APP_TITLE;
const devServerPort = process.env.STUDY_MANAGER_DEV_SERVER_PORT;

console.log('STUDY_MANAGER_API_URL =', apiUrl);

module.exports = (
    env = {
        dev: true,
    },
) => {
    const {ifProd, ifNotProd} = getIfUtils(env);

    return {
        mode: ifProd('production', 'development'),
        context: resolve('js'),
        entry: './app.js',
        output: {
            filename: ifProd('bundle.[name].[chunkhash].js', 'bundle.[name].js'),
            chunkFilename: '[name].[chunkhash].js',
            path: resolve('build/'),
            publicPath: '/',
        },
        resolve: {
            extensions: ['.js', '.jsx', '.json'],
        },
        devServer: {
            inline: true,
            port: devServerPort || 8080
        },
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
                version: ifProd(process.env.npm_package_version, "Dev"),
                year: new Date().getFullYear(),
                title: appTitle,
                template: 'index.html',
                inject: true,
                minify: true,
            }),
            new InlineManifestWebpackPlugin(),

            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: ifProd('"production"', '"development"'),
                    NPM_PACKAGE_VERSION: JSON.stringify(process.env.npm_package_version),
                    ...Object.keys(dotenvConfig.parsed).reduce((acc, key) => {
                        return {...acc, [key]: JSON.stringify(dotenvConfig.parsed[key])};
                    }, {}),
                },
            }),

        ])
    };
};