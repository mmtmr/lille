const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const pages = ["calendar", "task", "timelog", "chart"]
module.exports = {

    mode: 'development',
    devtool: 'source-map',



    entry: pages.reduce((config, page) => {
        config[page] = `./src/${page}/${page}.jsx`;
        return config;
        console.log(config);
    }, {}),

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
            test: /\.ico?$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                }
            }]
        }
        ]
    },
    plugins: [].concat(
        pages.map(
            (page) => 
                new HtmlWebpackPlugin({
                    title: 'Lille',
                    inject: true,
                    template: 'src/index.html',
                    filename: `${page}.html`,
                    favicon: 'src/favicon.ico',
                    chunks: [page]
                }),
        ),
    ),
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist'),
    },

devServer: {
    proxy: {
        "/api": {
            target: "http://localhost:5000",
            }
    }
}

}