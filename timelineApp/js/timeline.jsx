import React from 'react';
import drawTimeline from './helpers.js';
import Documents from './documents.jsx';
import '../static/css/style.css'; 

export default class Timeline extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dotLocations: [],
      dotColors: [],
    };
  }

  componentDidMount() {
    var dotInfo = drawTimeline(this.props);
    this.setState(
      {
        dotLocations: dotInfo["locations"],
        dotColors: dotInfo["colors"]
      }
    );
  }

  //componentDidUpdate(prevProps) {
    //var dotLocations = drawTimeline2(this.props);
  //}

  render() {
    console.log("printing dotLocations");
    console.log(this.state.dotLocations);

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
            <Documents data={this.props.data} docImages={this.props.docImages} clusterBy={this.props.clusterBy} documents={this.props.documents} dotLocations={this.state.dotLocations} dotColors={this.state.dotColors} />
          </div>

        </div>
      )
    }
  }
}