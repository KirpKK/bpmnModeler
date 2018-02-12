const path = require('path');
//const ExtractTextPlugin = require('extract-text-webpack-plugin');

  module.exports = {
	  
  entry: './routes/index.js',
  output: {
    filename: 'packedindex.js',
    path: path.resolve(__dirname, 'routes')
  },
  
  module: {
     loaders: [
		{
			test: /\.css$/,
		use: ['style-loader','css-loader']
			
		},
		{
         test: /\.(png|svg|jpg|gif)$/,
         loader: 'file-loader'
       },
       {
         test: /\.(woff|woff2|eot|ttf|otf)$/,
         loader: 'file-loader'
       },
		{
		   test: /\.(csv|tsv)$/,
          loader: 'csv-loader'
		},
   	{ 
   	  test: /\.xml$/, 
   	  loader: 'xml-loader'
   	} 
	 ]
  }
 //plugins: [
 //   new ExtractTextPlugin('bundle.css')
// ]
	
};
