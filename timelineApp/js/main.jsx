import React from 'react';
import ReactDOM from 'react-dom';
import DataVisualization from './dataVisualization';

ReactDOM.render(
  <DataVisualization url="/api/stories/3/" views="/api/stories/3/views" />,  //TODO: Don't hardcode in this 3 !
  document.getElementById('reactEntry'),
);
