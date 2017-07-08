import path from 'path';
import webpack from 'webpack';

const PRODUCTION = process.argv.includes('--release');
const VERBOSE = process.argv.includes('--verbose');

const SCRIPTS_ROOT = path.resolve(__dirname, 'src');
const env = PRODUCTION ? 'production' : 'development';

const common = {
  entry : {},
  output: {
    publicPath  : '/intent',
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
      new webpack.optimize.AggressiveMergingPlugin(),
    ] : []),
  ],

  cache: !PRODUCTION,
  bail: PRODUCTION,

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
    extensions: ['.js', '.json'],
  },

  module: {
    loaders: [
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

  name: 'client',
  target: 'web',

  entry : {
    index: path.join(SCRIPTS_ROOT, '/core/application/index.js'),
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
};

const server = {
  ...common,

  name: 'server',
  target: 'node',

  entry  : {
    server: path.join(SCRIPTS_ROOT, '/server.js'),
  },
  output : {
    ...common.output,

    path: path.join(SCRIPTS_ROOT, '/../bin'),
    libraryTarget: 'commonjs2',
  },
  plugins: [
    ...common.plugins,
    new webpack.BannerPlugin({
      banner: `#!/usr/bin/env node\nif (process.env.ENV !== 'production') {\n\trequire('source-map-support').install();\n}`,
      raw: true,
      entryOnly: false,
    }),

    // new webpack.BannerPlugin({banner: '#!/usr/bin/env node', raw: true}),
  ],

  resolve: {
    ...common.resolve,

    alias: {},
  },

  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },

  externals: {  // What I want to avoid to do
    'package.json'    : 'commonjs package.json',
    'yargs'    : 'commonjs yargs',
    'socket.io': 'commonjs socket.io',
    'express': 'commonjs express',
    'serve-index': 'commonjs serve-index',
    'source-map-support': 'commonjs source-map-support',
  },
};

export default [client, server];
