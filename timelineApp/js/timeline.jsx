import React from 'react';
import drawTimeline from './helpers.js'
import drawTimeline2 from './helpers2.js';
import Documents from './documents.jsx';
import '../static/css/style.css'; 
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
      <div id="timelines">
        <div id="timeline1" />
        <div id="timeline2" />
        <div id="DocumentsDiv">
          <Documents index={(this.props.isUpper == true) ? 0 : 1} data={this.props.data} docImages={this.props.docImages} clusterBy={this.props.clusterBy} documents={this.props.documents} />
        </div>
      </div>
    )
  }

}