const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const helpers = require("./helpers");


module.exports = {
    entry: {
        "vendor": "./src/structure-view/vendor.ts",
        "app": "./src/structure-view/main.ts"
    },

    resolve: {
        extensions: [".js", ".ts"]
    },

    module: {
        rules: [
            {test: /\.ts$/, use: "awesome-typescript-loader"},
            {test: /\.html$/, use: "html-loader"},
            {test: /\.(png|jpe?g|gif|woff|woff2|ttf|eot|ico)$/,use: "file-loader?name=assets/[name].[hash].[ext]"},
            {test: /\.svg/, use: "file-loader?name=assets/[name].[ext]"},
            {test: /\.css$/,
                exclude: helpers.root("src", "app"),
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader?sourceMap"
                })
            },
            {test: /\.scss$/, use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"},
                    {loader: "sass-loader"}
                ]
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("[name].css"),
        new HtmlWebpackPlugin({
            template: "src/structure-view/index.html"
        })
    ]
};
