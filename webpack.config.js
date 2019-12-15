const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')
const path = require('path')

module.exports = async (env, argv) => ({
  mode: ['development', 'production'].includes(argv.mode) ? argv.mode : 'none',
  entry: {
    app: path.resolve(__dirname, 'src/pages/index.jsx'),
    register: path.resolve(__dirname, 'src/lib/register.js')
  },

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
      chunks: ['app', (argv.mode === 'production' ? 'register' : null)].filter(Boolean),
      filename: 'index.html'
    }),
    new ScriptExtHtmlWebpackPlugin({
      async: 'app.js',
      defer: 'register.js'
    }),
    new CopyWebpackPlugin([{ from: 'static', to: 'static' }]),
    argv.mode === 'production'
      ? new WorkboxPlugin.GenerateSW({
        swDest: path.resolve(__dirname, 'dist/sw.js'),
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: new RegExp('/'),
            handler: 'cacheFirst',
            options: {
              cacheName: 'voicelot-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 365 * 24 * 60 * 60
              },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }) : null
  ].filter(Boolean)
})
