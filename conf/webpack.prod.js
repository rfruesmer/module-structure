const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const helpers = require("./helpers");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const ENV = process.env.NODE_ENV = process.env.ENV = "production";

module.exports = webpackMerge(commonConfig, {
    output: {
        path: helpers.root("dist/web-app"),
        publicPath: "",
        filename: "[name].[hash].js",
        chunkFilename: "[id].[hash].chunk.js"
    },

    module: {
        rules: [
            {test: /\.ts$/, use: "awesome-typescript-loader?configFileName=conf/tsconfig.prod.json"}
        ]
    },
    optimization: {
        minimizer: [new UglifyJsPlugin()]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                "ENV": JSON.stringify(ENV)
            }
        })
    ]
});
