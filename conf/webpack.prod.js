const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const commonConfig = require("./webpack.common.js");
const helpers = require("./helpers");
const ENV = process.env.NODE_ENV = process.env.ENV = "production";

module.exports = webpackMerge(commonConfig, {
    mode: "production",
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
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                "ENV": JSON.stringify(ENV)
            }
        })
    ],
    optimization: {
        minimizer: [new UglifyJsPlugin()]
    }
});
