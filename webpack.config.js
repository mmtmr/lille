const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {

    mode: 'development',
    devtool: 'source-map',

    entry: './src/main.jsx',
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: 'babel-loader' // will use .babelrc
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        },
        {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts/'
                }
            }]
        },
        {
            test: /\.(ico|jpg)?$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                }
            }]
        }
        ]
    },
    // plugins: [].concat(
    //     pages.map(
    //         (page) =>
    //             new HtmlWebpackPlugin({
    //                 title: 'Lille',
    //                 inject: true,
    //                 template: 'public/index.html',
    //                 filename: `${page}.html`,
    //                 favicon: 'public/favicon.ico',
    //                 chunks: [page]
    //             }),
    //     ),
    // ),
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Lille',
            inject: true,
            template: 'public/index.html',
            // filename: `${page}.html`,
            favicon: 'public/favicon.ico',
            // chunks: [page]
        })
        // ,
        // new webpack.ProvidePlugin({
        //     process: 'process/browser',
        //   }),
    ],
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        publicPath: '/'
    },

    devServer: {
        // contentBase: path.join(__dirname, 'public'),
        historyApiFallback: true,
        proxy: {
            "/api": {
                target: "http://localhost:5000",
                changeOrigin: true,
            },
            "/auth": {
                target: "http://localhost:5000",
                changeOrigin: true,
            },
        }
    },
    stats: {
        errorDetails: true,
      },

}