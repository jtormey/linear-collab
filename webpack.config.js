const path = require('path')
const webpack = require('webpack')
const env = require('node-env-file')

let resolve = (f) => path.join(__dirname, f)

let loadEnvVars = [
  'NODE_ENV'
]

if (process.env.NODE_ENV == null) {
  env('.env')
}

let base = {
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
      'background': resolve('src/background'),
      'content': resolve('src/content')
    }
  }
]
