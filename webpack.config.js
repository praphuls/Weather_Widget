var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './src/main.js',
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                test: path.join(__dirname, 'src'),
                query: {
                  presets: 'es2015',
                },
            },
            { test: /\.hbss$/, loader: "handlebars-loader", query: { presets: 'es2015'} }
        ]
    },
    plugins: [
        // Avoid publishing files when compilation fails
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            sourceMap: true,
            compress: {
                drop_console: true
            },
            mangle: {
                except: ['$super', '$', 'exports', 'require', '$q', '$ocLazyLoad']
            },
            compressor: {
                warnings: false
            }
        })
    ],
    stats: {
        // Nice colored output
        colors: true
    },
    // Create Sourcemaps for the bundle
    devtool: 'source-map',
};