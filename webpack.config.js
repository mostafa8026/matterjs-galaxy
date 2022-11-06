const path = require("path");
var HtmlWebpackPlugin = require('html-webpack-plugin')


console.log(__dirname);
module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    port: 9061,
    static: ['./src', './public'], // both src and output dirs
    liveReload: true,
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  }
};

if (process.env.NODE_ENV !== 'production') {
  module.exports.plugins = (module.exports.plugins || []).concat([
      new HtmlWebpackPlugin({
          template: './src/index.html'
      })
  ])
}
