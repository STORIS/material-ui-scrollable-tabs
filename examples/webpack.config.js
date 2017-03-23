const combineLoaders = require('webpack-combine-loaders');
const dotenv = require('dotenv');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const NODE_ENV = process.env.NODE_ENV;

// import .env variables to global space
const dotEnvVars = dotenv.config();
const dotEnvDefines = !dotEnvVars.error ? dotEnvVars.parsed : {};
const defines =	Object.keys(dotEnvDefines).reduce((accumulator, key) => {
  const retAccumulator = accumulator;
  const val = JSON.stringify(dotEnvDefines[key]);
  retAccumulator[`__${key.toUpperCase()}__`] = val;
  return retAccumulator;
}, {
  'process.env': {
    NODE_ENV: JSON.stringify(NODE_ENV),
  },
});

const config = {
  entry: [
    'react-hot-loader/patch',
    'webpack/hot/only-dev-server',
    path.resolve(__dirname, 'src', 'index.js'),
  ],
  output: {
    filename: 'app.js',
    publicPath: '/',
  },
  devtool: 'source-map',
  devServer: {
    inline: true,
    historyApiFallback: true,
    hot: true,
    port: 3000,
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)?$/,
      exclude: /node_modules/,
      loaders: ['babel-loader'],
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: combineLoaders([{
          loader: 'css-loader',
          query: {
            modules: true,
            localIdentName: '[name]__[local]___[hash:base64:5]',
          },
        }]),
      }),
    }],
  },
  plugins: [
    new webpack.DefinePlugin(defines),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src', 'www', 'index.html'),
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin('styles.css'),
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules'),
      'node_modules',
    ],
    extensions: [
      '.js',
      '.jsx',
    ],
    alias: {
      'material-ui-scrollable-tabs': path.resolve(__dirname, '../src'),
    },
  },
};

module.exports = config;
