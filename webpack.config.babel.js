import path from 'path';
import webpack from 'webpack';

const PRODUCTION = process.argv.includes('--release');
const VERBOSE = process.argv.includes('--verbose');

const SCRIPTS_ROOT = path.resolve(__dirname, 'src');
const env = PRODUCTION ? 'production' : 'development';

const common = {
  entry : {},
  output: {
    publicPath  : '/static/',
    sourcePrefix: '  ',
    filename    : PRODUCTION ? '[name].js' : '[name].js?[hash]',
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: !PRODUCTION,
    }),

    new webpack.ProvidePlugin({}),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': `"${env}"`,
      '__DEV__'             : !PRODUCTION,
    }),
    ...(PRODUCTION ? [
      new webpack.optimize.OccurenceOrderPlugin(),
      // new webpack.optimize.AggressiveMergingPlugin(),
    ] : []),
  ],

  cache: !PRODUCTION,
  bail : PRODUCTION,

  watchOptions: {
    aggregateTimeout: 200,
    ignored         : /node_modules/,
  },

  stats: {
    colors      : true,
    reasons     : !PRODUCTION,
    hash        : VERBOSE,
    version     : VERBOSE,
    timings     : true,
    chunks      : VERBOSE,
    chunkModules: VERBOSE,
    cached      : VERBOSE,
    cachedAssets: VERBOSE,
  },


  resolve: {
    modules   : ['src', SCRIPTS_ROOT, 'node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },

  module: {
    loaders: [
      {
        test  : /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      },
      {
        test  : /\.json$/,
        loader: 'json-loader',
      }, {
        test  : /\.txt$/,
        loader: 'raw',
      },
    ],
  },

};

const client = {
  ...common,

  name  : 'client',
  target: 'web',

  entry : {
    index: path.join(SCRIPTS_ROOT, '/core/application/index.tsx'),
  },
  output: {
    ...common.output,

    path: path.join(SCRIPTS_ROOT, '/core/application/web'),
  },

  resolve: {
    ...common.resolve,

    alias: {
      'react'    : 'react-lite',
      'react-dom': 'react-lite',
    },
  },

  plugins: [
    ...common.plugins,

    new webpack.ProvidePlugin({
      $              : 'jquery',
      jQuery         : 'jquery',
      'window.jQuery': 'jquery'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name     : 'vendor',
      minChunks: module => /node_modules/.test(module.resource),
    }),

    ...PRODUCTION ? [
      // new webpack.optimize.ModuleConcatenationPlugin(),
      //
      // // Minimize all JavaScript output of chunks
      // // https://github.com/mishoo/UglifyJS2#compressor-options
      // new webpack.optimize.UglifyJsPlugin({
      //   sourceMap: true,
      //   compress: {
      //     screw_ie8: true, // React doesn't support IE8
      //     warnings: isVerbose,
      //     unused: true,
      //     dead_code: true,
      //   },
      //   mangle: {
      //     screw_ie8: true,
      //   },
      //   output: {
      //     comments: false,
      //     screw_ie8: true,
      //   },
      // }),
    ] : []
  ],

  module: {
    ...common.module,
    loaders: [
      ...common.module.loaders,
      {
        test  : /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test  : /\.(png|jpg|jpeg|gif)$/,
        loader: 'url-loader?limit=10000',
      }, {
        test  : /\.(wav|mp3|ogg)$/,
        loader: 'url-loader?name=sounds/[name].[ext]',
      }, {
        test  : /\.(eot|ttf|svg|woff|woff2)$/,
        loader: 'file-loader?name=styles/fonts/[name].[ext]',
      },
    ],
  },

};

const server = {
  ...common,

  name  : 'server',
  target: 'node',

  entry  : {
    server: path.join(SCRIPTS_ROOT, '/server.ts'),
  },
  output : {
    ...common.output,

    path: path.join(SCRIPTS_ROOT, '/../bin'),
    // libraryTarget: 'commonjs2',
  },
  plugins: [
    ...common.plugins,

    new webpack.BannerPlugin({
      banner   : `#!/usr/bin/env node\nif (process.env.ENV !== 'production') {\n\trequire('source-map-support').install();\n}`,
      raw      : true,
      entryOnly: false,
    }),

    // new webpack.BannerPlugin({banner: '#!/usr/bin/env node', raw: true}),

    new webpack.SourceMapDevToolPlugin({
      filename                      : '[name].js.map',
      sourceRoot                    : '/',
      noSources                     : true,
      moduleFilenameTemplate        : '[absolute-resource-path]',
      fallbackModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  ],

  resolve: {
    ...common.resolve,

    alias: {},
  },

  node     : {
    __dirname: false,
  },
  externals: {  // What I want to avoid to do
    'package.json'      : 'commonjs package.json',
    'yargs'             : 'commonjs yargs',
    'socket.io'         : 'commonjs socket.io',
    'express'           : 'commonjs express',
    'serve-index'       : 'commonjs serve-index',
    'source-map-support': 'commonjs source-map-support',
  },
};

export default [client, server];
