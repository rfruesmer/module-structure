const HtmlWebpackPlugin = require("html-webpack-plugin");


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
            {test: /\.css$/, use: "raw-loader"},
            {test: /\.scss$/, use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"},
                    {loader: "sass-loader"}
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/structure-view/index.html"
        })
    ]
};
