const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const package = require("./package.json");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  entry: path.resolve(__dirname, "./src/js/main.ts"),
  devtool: isProduction ? false : "source-map", // Disable source maps in production
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "phaser",
          enforce: true,
          chunks: "initial",
        },
      },
    },
  },
  resolve: {
    extensions: [".js", ".ts", ".json"],
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].js",
    clean: true,
  },
  devServer: {
    static: path.resolve(__dirname, "./dist"),
    hot: true,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/assets/",
          to: "assets/",
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/index.html"),
      filename: "index.html",
      title: package.description,
      inject: "body",
      hot: true,
    }),
  ],
  mode: isProduction ? "production" : "development",
};
