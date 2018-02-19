const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

  module.exports = {
	  
  entry: './routes/index.js',
  output: {
    filename: 'packedindex.js',
    path: path.resolve(__dirname, 'routes')
  },
  node: {
        fs: 'empty',
},
  
  module: {
     loaders: [
		{
			test: /\.css$/,
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: 'css-loader'
			})
		},
		{
         test: /\.(png|svg|jpg|gif)$/,
         loader: ExtractTextPlugin.extract('file-loader')
       },
       {
         test: /\.(woff|woff2|eot|ttf|otf)$/,
         loader: ExtractTextPlugin.extract('file-loader')
       },
		{
		   test: /\.(csv|tsv)$/,
          loader: ExtractTextPlugin.extract('csv-loader')
		},
   	{ 
   	  test: /\.xml$/, 
   	  loader: ExtractTextPlugin.extract('xml-loader') 
   	} 
	 ]
  },
 plugins: [
    new ExtractTextPlugin('bundle.css')
 ]
	
};
