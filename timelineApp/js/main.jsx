import React from 'react';
import ReactDOM from 'react-dom';
import TimelineView from './timelineView';

ReactDOM.render(
  <TimelineView url="/api/stories/3/" />,  //TODO: Don't hardcode in this 3 !
  document.getElementById('reactEntry'),
);
