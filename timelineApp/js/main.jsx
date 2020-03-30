import React from 'react';
import ReactDOM from 'react-dom';
import DataVisualization from './dataVisualization';
//import '../static/css/style.css';
//import "regenerator-runtime/runtime.js";
//import 'babel-core/register';
//import 'babel-polyfill';

ReactDOM.render(
  <DataVisualization dataUrl="/api/stories/3/" viewsUrl="/api/stories/3/views" />,  //TODO: Don't hardcode in this 3 !
  document.getElementById('reactEntry'),
);
