import React from 'react';
import ReactDOM from 'react-dom';
import DataVisualization from './dataVisualization';

const storyid = document.getElementById('reactEntry').getAttribute('data-param');

ReactDOM.render(
  <DataVisualization dataUrl={"/api/stories/" + storyid + "/"} viewsUrl={"/api/stories/" + storyid + "/views"} />,
  document.getElementById('reactEntry'),
);
