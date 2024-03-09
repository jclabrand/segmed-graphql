
const path = require('path')
const nodeExternals = require('webpack-node-externals')


module.exports = {
	target: 'node',

	node: {
		__filename: true,
		__dirname: false
	},

	externals: [nodeExternals()],

	entry: {
		'index.js': './src/index.ts'
	},

	module: {
		rules: [
			{
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},

	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	},

	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist')
	}
}
