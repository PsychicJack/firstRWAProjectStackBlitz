const path = require("path");

module.exports = {
    entry: ["babel-polyfill", "./src/index.ts"],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
        publicPath: "/dist",
    },
    devServer: {
        contentBase: __dirname,
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
            { test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ },
        ],
    },
};
