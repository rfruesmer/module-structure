const webpackMerge = require("webpack-merge");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const commonConfig = require("./webpack.common.js");
const helpers = require("./helpers");

module.exports = webpackMerge(commonConfig, {
    devtool: "source-map",

    output: {
        path: helpers.root("dist/web-app"),
        publicPath: "http://localhost:8080/",
        filename: "[name].js",
        chunkFilename: "[id].chunk.js"
    },

    plugins: [
        new ExtractTextPlugin("[name].css")
    ],

    module: {
        rules: [
            {test: /module-structure\.json/, use: "file?name=[name].[ext]"}
        ]
    },

    devServer: {
        historyApiFallback: true,
        stats: {colors: true},
        hot: true,
        inline: true,
        progress: true
    }
});
