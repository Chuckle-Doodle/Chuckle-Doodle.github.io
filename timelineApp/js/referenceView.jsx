import React from 'react';
import Timeline2 from './timeline.jsx';
import fetch from 'isomorphic-fetch';
//import timelineHelper from './timelinePlugin.js';
//import * as d3 from 'd3';
import Map from './map.js';
import '../static/css/style.css';

export default class ReferenceView extends React.Component {
  constructor(props) {
    super(props);
    //this.state = {
      //data: [],
    //};

    //NOTE: IF THIS CLASS HAS NO STATE, IT CAN BE MADE A FUNCTIONAL COMPONENT INSTEAD

  }

  /*
  componentDidMount() {
    // Runs when an instance is added to the DOM
    // Call REST API to get data
    fetch(this.props.url, { credentials: 'same-origin' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        //this.setState({
          //data: data.Black_Death
        //});
      })
      .catch(error => console.log(error)); // eslint-disable-line no-console
  }
  */


  render() {
/*
    var testData = [
  {label: "person a", times: [
    {"starting_time": 1355752800000, "ending_time": 1355759900000},
    {"starting_time": 1355767900000, "ending_time": 1355774400000}]},
  {label: "person b", times: [
    {"starting_time": 1355759910000, "ending_time": 1355761900000}]},
  {label: "person c", times: [
    {"starting_time": 1355761910000, "ending_time": 1355763910000}]}
  ];

    var chart = drawTimelines();
    var svg = d3.select("#timeline1").append("svg").attr("width", 500)
  .datum(testData).call(chart);
  */

    //find out which type of ReferenceView we have, timeline or map
    const refViewType = this.props.type;
    //var isUpper = true;

    return (
      <div >
        <div>

          {refViewType == "Timeline" ? (
              <Timeline2 docImages={this.props.docImages} viewName={this.props.viewName} clusterBy={this.props.clusterBy} dataUrl={this.props.dataUrl} data={this.props.data} documents={this.props.documents} question={this.props.question} isUpper={this.props.isUpper} />
            ) : (
              <Map viewName={this.props.viewName} clusterBy={this.props.clusterBy} dataUrl={this.props.dataUrl} data={this.props.data} documents={this.props.documents} question={this.props.question} isUpper={this.props.isUpper} />
            )
          }
        </div>

      </div>
    );
  }
}

//<p>Jimmy is a good lawyer.</p>
//<Timeline viewName={this.props.viewName} clusterBy={this.props.clusterBy} dataUrl={this.props.dataUrl} data={this.props.data} documents={this.props.documents} question={this.props.question} isUpper={this.props.isUpper} />