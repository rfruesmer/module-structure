var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var helpers = require("./helpers");
var path = require("path");

module.exports = {
    entry: {
        "vendor": "./src/structure-view/vendor.ts",
        "app": "./src/structure-view/main.ts"
    },

    resolve: {
        extensions: ["", ".js", ".ts"]
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: ["awesome-typescript-loader"]
            },
            {
                test: /\.html$/,
                loader: "html"
            },
            {
                test: /\.(png|jpe?g|gif|woff|woff2|ttf|eot|ico)$/,
                loader: "file?name=assets/[name].[hash].[ext]"
            },
            {
                test: /\.svg/,
                loader: "file?name=assets/[name].[ext]"
            },
            {
                test: /\.css$/,
                exclude: helpers.root("src", "app"),
                loader: ExtractTextPlugin.extract("style", "css?sourceMap")
            },
            {
                test: /\.css$/,
                include: helpers.root("src", "app"),
                loader: "raw"
            },
            {
                test: /\.scss$/,
                loaders: ["style", "css", "sass"]
            }
        ]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ["app", "vendor"]
        }),

        new HtmlWebpackPlugin({
            template: "src/structure-view/index.html"
        })
    ]
};
