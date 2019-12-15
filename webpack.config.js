const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = async (env, argv) => ({
  mode: ['development', 'production'].includes(argv.mode) ? argv.mode : 'none',
  entry: { app: path.resolve(__dirname, 'src/pages/index.jsx') },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },

  module: {
    rules: [{
      test: /\.jsx$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      chunks: [ 'app' ],
      filename: `index.html`
    }),
    new CopyWebpackPlugin([{ from: 'static', to: 'static' }])
  ]
})
