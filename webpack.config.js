const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

const dist = path.join(__dirname, "demo");
const isProd = process.env.NODE_ENV === "production";

module.exports = {
  entry: ["./src/dev.ts"],
  output: {
    filename: "[name].[hash].js",
    path: dist
  },
  devtool: isProd ? "eval" : "inline-source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: ["babel-loader", "ts-loader"]
      },
      {
        test: /\.css$/i,
        include: /node_modules/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: '[name]__[local]'
              }
            }
          }
        ]
      },
      {
        test: /\.scss$/i,
        exclude: /node_modules/,
        loader: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[name]__[local]'
              }
            }
          },
          "postcss-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: !isProd
            }
          },
          {
            loader: "sass-resources-loader",
            options: {
              resources: ["./src/styles/_variables.scss",  "./src/styles/_queries.scss", "./src/styles/_grid.scss"]
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader"
      }
    ]
  },
  devServer: {
    port: 3000
  },
  resolve: {
    extensions: [".ts", ".js", ".scss"]
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: "./config/index.html",
      wistiauri: '//fast.wistia.com/assets/external/E-v1.js',
      wistiacharset: 'ISO-8859-1',
      wistiajson: 'https://fast.wistia.com/embed/medias/b7g57f7mn4.jsonp',
    })
  ]
};
