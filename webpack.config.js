// Load external libs
var path = require('path');
var webpack = require("webpack");
//var WebpackChunkHash = require("webpack-chunk-hash"); // override hashing of chunks using md5
//var HtmlWebpackPlugin = require('html-webpack-plugin'); // generate the html using webpack and templates
//var InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin'); // 2nd attempt at inlining the manifest
//var FaviconsWebpackPlugin = require('favicons-webpack-plugin'); // generate favicons for multiple devices
//var CleanWebpackPlugin = require('clean-webpack-plugin'); // empty build dirs on re-build
//var ExtractTextPlugin = require("extract-text-webpack-plugin"); // handling CSS files

// Parse environment
var development = process.env.NODE_ENV !== "production";
var clean = process.env.BUILD_CLEAN == "true";

// Babel transpiler options
var babelOptions = {
  'cacheDirectory': true,
  "presets": [
    [
      "es2015",
      {
        "modules": false
      }
    ],
    "es2016"
  ]
};

// Set some paths
const BASE_PATH = path.resolve(__dirname, 'src');
const SCRIPT_PATH = path.resolve(BASE_PATH, 'script');
const STYLE_PATH = path.resolve(BASE_PATH, 'stylesheet');
const IMAGE_PATH = path.resolve(BASE_PATH, 'image');

module.exports = {
  context: BASE_PATH,
  entry: {
    vendor: ["lodash", "pixi.js", path.resolve(SCRIPT_PATH, "vendor.ts")],
    app: path.resolve(SCRIPT_PATH, "app.ts")
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: development ? "[name].js" : "[name].[chunkhash].js",
    chunkFilename: development ? "[name].js" : '[name].[chunkhash].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: [
          BASE_PATH,
          path.resolve(__dirname, "node_modules/normalize.css/")
        ],
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        use: {
          loader: 'json-loader',
        }
      },
      {
        test: /\.yaml$/,
        exclude: /node_modules/,
        use: ['json-loader', 'yaml-loader'],
      },
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions
          },
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i, // Notes: Embed small images in CSS via data-urls
        exclude: /node_modules/,
        use: [
          {
            loader: 'url-loader',
            query: {
              limit: 10000
            }
          },
          {
            loader: 'image-webpack-loader',
            query: {
              mozjpeg: { progressive: true },
              gifsicle: { interlaced: false },
              optipng: { optimizationLevel: 7 },             
              pngquant: {
                quality: '65-90',
                speed: 4
              }
            }
          }
        ],
      }
    ]
  },
  resolve: {
    extensions: ['*', '.ts', '.tsx', '.js', '.json', '.css', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'eot', 'ttf', 'woff', 'woff2']
  },
  plugins: [
    // Clean up existing
    clean ? new CleanWebpackPlugin(['dist', 'build']) : function () { },

    // Production optimizations
    development ? function () { } : new webpack.optimize.OccurrenceOrderPlugin(),
    development ? function () { } : new webpack.optimize.UglifyJsPlugin(),

    // Break out vendor and manifest common chunks
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
      minChunks: Infinity
    }),
    new ExtractTextPlugin("[name].css"),

    // Build Index.html
    new HtmlWebpackPlugin({
      inject: false,
      template: require('html-webpack-template'),
      inlineManifestWebpackName: 'webpackManifest',
      title: 'WebRTC Experiment',
      mobile: true,
      meta: [
        {
          name: 'description',
          content: 'An experiment with the WebRTC protocol.'
        }
      ],
      minify: {
        'collapseWhitespace': development ? false : true,
        'preserveLineBreaks': true,
      },
    }),
    new InlineManifestWebpackPlugin({
      name: 'webpackManifest'
    }),
    new FaviconsWebpackPlugin({
      logo: path.resolve(IMAGE_PATH, 'favicon.png'),
      prefix: 'favicons-[hash]/',
      title: 'app-favicon',
      persistentCache: true,
      emitStats: false,
      inject: true,
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        coast: false,
        favicons: true,
        firefox: true,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false
      }
    }),

    // Hash chunks
    development ? new webpack.NamedModulesPlugin() : new webpack.HashedModuleIdsPlugin(),
    new WebpackChunkHash(),
  ]
};
