import React from 'react';
import drawTimeline from './helpers.js'
import drawTimeline2 from './helpers2.js';
//import timelineHelper from './timelinePlugin.js';

//  **** UNSURE IF BELOW IMPORT OF ALL OF D3 IS NEEDED *********
//import * as d3 from 'd3';

//import './drawLines.js';   --> Alex's work
//import timeline from '../static/d3-timeline.js';
//import '../static/css/style.css';
//import timelines from '../static/d3-timeline-2.js';


export default class Timeline2 extends React.Component {
  componentDidMount() {
    drawTimeline2(this.props)
  }

  componentDidUpdate(prevProps) {
    drawTimeline2(this.props)
  }

  render() {

    return (
      <div id="timeline1" />
    )
  }

}




/*
var isUpper = true;

const Timeline = ({viewName, clusterBy, dataUrl, data, documents, question, isUpper}) => {

  console.log("atop Timeline function in timeline.js");

  if (isUpper == true)
  {
    return (<p>Upper Timeline - {question}</p>)
  }
  else
  {
    return (<p> Lower Timeline - {question}</p>)
  }

};

export default Timeline; */