const dev = process.env.NODE_ENV === 'dev'
const path = require('path');
const Uglify = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractPlugin = new ExtractTextPlugin({
  filename: 'main.css',
  allChunks: true,
})

let config = {
	entry: { main: './app.js' },
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'main.js',
		//library: path.resolve(__dirname, 'app/app')
	},
	watch: dev,
	devtool: "source-map", // dev ? "cheap-module-eval-source-map" : "source-map",
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
				test: /\.(css|styl)$/,
				use: ['css-hot-loader'].concat(extractPlugin.extract({
					use: [
						{
							loader: 'css-loader?sourceMap', 
							options: {
								importLoaders: 1, 
								sourceMap: true, 
								minimize: !dev
							}
						},
						{
							loader: 'stylus-loader?sourceMap',
							options: { sourceMap: dev },
						},
					]
				}))
			}
		]
	},
	resolve: {
		modules: [
			'public/page',
			'public/wrap',
			'public/part',
			'app/app',
			'node_modules',
			'./',
		],
		extensions: ['.js', '.css', '.scss'],
	},
	plugins: [extractPlugin]
}

if(!dev){
	config.plugins.push(new Uglify())
}

module.exports = config