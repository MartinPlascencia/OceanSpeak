const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const package = require("./package.json");

module.exports = {
  entry: path.resolve(__dirname, "./src/js/main.ts"),
  devtool: "source-map",
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
      // JSON is natively supported from Webpack 4+
      // No need for a specific loader
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
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
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
};
