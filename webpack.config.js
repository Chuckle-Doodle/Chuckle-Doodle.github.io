const path = require('path');

module.exports = {
  entry: ['babel-regenerator-runtime', './timelineApp/js/main.jsx'],
  output: {
    path: path.join(__dirname, '/timelineApp/static/js/'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        // Test for js or jsx files
        test: /\.jsx?$/,
        loader: 'babel-loader',
        query: {
          // Convert ES6 syntax to ES5 for browser compatibility
          presets: ['env', 'react'],
        },
      },
      { 
        test: /\.css$/, 
        loader: "style-loader!css-loader" 
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
