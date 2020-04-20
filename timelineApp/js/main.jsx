import React from 'react';
import ReactDOM from 'react-dom';
import DataVisualization from './dataVisualization';

const storyid = document.getElementById('reactEntry').getAttribute('data-param');
const username = document.getElementById('reactEntry').getAttribute('data-param2');

ReactDOM.render(
  <DataVisualization dataUrl={"/api/stories/" + storyid + "/" + username + "/"} viewsUrl={"/api/stories/" + storyid + "/views"} storyid={storyid} />,
  document.getElementById('reactEntry'),
);
