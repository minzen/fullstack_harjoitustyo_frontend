const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

module.exports = env => {
  console.log('BACKEND_WS_URI: ', env.BACKEND_WS_URI)
  console.log('BACKEND_HTTP_URI: ', env.BACKEND_HTTP_URI)

  // create a nice object from the env variable
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next])
    return prev
  }, {})

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, './build'),
      filename: 'main.js'
    },
    node: {
      fs: 'empty'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          query: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        },
        {
          test: /\.css$/,
          loaders: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: 'file-loader'
            }
          ]
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin(envKeys),
      new HtmlWebpackPlugin({ template: 'index.template.ejs', inject: 'body' })
    ],
    devServer: {
      contentBase: path.resolve(__dirname, 'build'),
      compress: true,
      port: 3000
    },
    devtool: 'source-map'
  }
}
