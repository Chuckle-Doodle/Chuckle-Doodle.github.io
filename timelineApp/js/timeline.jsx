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

  constructor(props) {
    super(props);
    this.state = {
      dotLocations: [],
    };

    //NOTE: IF THIS CLASS HAS NO STATE, IT CAN BE MADE A FUNCTIONAL COMPONENT INSTEAD

  }

  componentDidMount() {
    var dotLocations = drawTimeline2(this.props);
    this.setState({dotLocations: dotLocations});
  }

  //componentDidUpdate(prevProps) {
    //var dotLocations = drawTimeline2(this.props);
  //}

  render() {

    if (this.props.isUpper == true)
    {
      return (
        <div id="timeline1" />
      )
    } else //this.props.isUpper == false
    {
      return (
        <div id="timelines">

          <div id="timeline2" />

          <div id="documentsDiv">
            <Documents data={this.props.data} docImages={this.props.docImages} clusterBy={this.props.clusterBy} documents={this.props.documents} dotLocations={this.state.dotLocations} />
          </div>

        </div>
      )
    }

  }
}