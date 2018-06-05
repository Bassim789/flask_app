// webpack v4
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Uglify = require('uglifyjs-webpack-plugin')
const dev = process.env.NODE_ENV === 'dev'
let config = {
	entry: { main: './src/index.js' },
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'main.js'
	},
	watch: dev,
	devtool: dev ? "cheap-module-eval-source-map" : "source-map",
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract(
					{
						fallback: 'style-loader',
						use: ['css-loader']
					})
			}
		]
	},
	plugins: []
}

if(!dev){
	config.plugins.push(new Uglify({
		sourceMap: true
	}))
}

module.exports = config