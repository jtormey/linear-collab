const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const env = require('node-env-file')

const resolve = (f) => path.join(__dirname, f)

const loadEnvVars = [
  'NODE_ENV'
]

if (process.env.NODE_ENV == null) {
  env('.env')
}

const base = {
  mode: process.env.NODE_ENV,
  devtool: false,
  output: {
    path: resolve('build'),
    filename: '[name].build.js'
  },
  resolve: {
    alias: {
      '@assets': resolve('assets'),
      '@manifest': resolve('manifest.json')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /manifest\.json$/,
        loader: 'file-loader',
        type: 'javascript/auto',
        options: {
          name: 'manifest.json'
        }
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin(loadEnvVars)
  ]
}

module.exports = [
  {
    ...base,
    entry: {
      background: resolve('src/background'),
      content: resolve('src/content')
    }
  },
  {
    ...base,
    entry: {
      menu: resolve('src/app-menu')
    },
    plugins: base.plugins.concat([
      new HtmlWebpackPlugin({
        filename: 'menu.html',
        template: resolve('src/app-menu/menu.html')
      })
    ])
  }
]
