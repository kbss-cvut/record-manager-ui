const dotenvConfig = require('dotenv-safe').config({
    allowEmptyValues: [ 'STUDY_MANAGER_BASENAME' ],
    sample: './.env.example',
});

const {resolve} = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {getIfUtils, removeEmpty} = require('webpack-config-utils');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
        entry: './index.js',
        output: {
            filename: ifProd('bundle.min.js', 'bundle.[name].js'),
            chunkFilename: '[name].[chunkhash].js',
            path: process.env.STATIC ? resolve("../../../target/study-manager-0.2.1/") : resolve('build/'),
            publicPath: process.env.STATIC ? '/study-manager' : "/",
        },
        resolve: {
            extensions: ['.js', '.jsx', '.json'],
        },
        devServer: {
            inline: true,
            port: devServerPort || 8080,
            historyApiFallback: true
        },
        devtool: 'source-map',
        /*optimization: {
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
        },*/
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
                basename: process.env.STATIC ? '/study-manager' : "",
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
                    },
                    {
                        from: resolve('./WEB-INF'),
                    }
                ],
                {copyUnmodified: true},
            ),

        ])
    };
};
