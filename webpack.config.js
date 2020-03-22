const {resolve} = require('path');

const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {getIfUtils, removeEmpty} = require('webpack-config-utils');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');

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
            port: 8080
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
                title: 'Fertility Study Manager',
                template: 'index.html',
                inject: true,
                minify: true,
            }),
            new InlineManifestWebpackPlugin(),

        ])
    };
};