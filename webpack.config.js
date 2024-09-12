const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlInlineCssPlugin = require("html-inline-css-webpack-plugin");
const HtmlInlineScriptPlugin = require("html-inline-script-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const devMode = process.env.NODE_ENV !== "production";
module.exports = {
    entry: [
        "./src/app.js",
        "./src/app.css"
    ],
    output: {
        path: __dirname + "/dist"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    devMode ? {loader: 'style-loader'} : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                        }
                    },
                    {
                        loader: 'postcss-loader'
                    }
                ]
            }
        ]
    },
    devServer: {
        open: true,
        compress: true,
        port: 3000
    },
    plugins: [
        new CssMinimizerPlugin({
            minimizerOptions: {
                preset: [
                    "default",
                    {
                        discardComments: {removeAll: true},
                    },
                ],
            }
        }),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: "./src/app.ejs",
            scriptLoading: "blocking",
            inject: true
        }),
        new HtmlInlineScriptPlugin(),
        new HtmlInlineCssPlugin.default()
    ]
}
