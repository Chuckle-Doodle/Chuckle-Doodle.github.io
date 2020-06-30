import React from 'react';
import drawTimeline from './helpers.js';
import Documents from './documents.jsx';
import '../static/css/style.css'; 

export default class Timeline extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dotLocations: [],
      render: false,
    };
  }

  componentDidMount() {
    var dotInfo = drawTimeline(this.props);
    this.setState(
      {
        dotLocations: dotInfo["locations"],
        //dotColors: dotInfo["colors"]
      }
    );

    setTimeout(function() { //Start the timer
      this.setState({render: true}) //After 4 second, set render to true
    }.bind(this), 4000)

  }

  //componentDidUpdate(prevProps) {
    //var dotLocations = drawTimeline2(this.props);
  //}

  render() {

    if (this.props.referenceViewOrder[0] == "Map" && this.props.referenceViewOrder[1] == "Timeline")
    {
      if (this.state.render == false)
      {
        return (
          <div id="timelines">

            <div id="timeline2" />

            <div id="documentsDiv" />

          </div>
        );
      }
    }

    //console.log("printing dotLocations");
    //console.log(this.state.dotLocations);
    //console.log("render function in timeline.jsx. Printing this.state.dotLocations");
    //console.log(this.state.dotLocations);
    if (this.state.dotLocations.length == 0)
    {
      if (this.props.isUpper == true)
      {
        return (
            <div id="timeline1"/>
        )
      } else
      {
        return (
          <div id="timelines">

            <div id="timeline2" />

            <div id="documentsDiv" />

          </div>
        );
      }
    }
    //console.log("got here", this.state.dotLocations);

    if (this.props.isUpper == true)
    {
      if (this.props.referenceViewOrder[1] != "Timeline")
      {
        return (
          <div id="timelines">

            <div id="timeline1" />

            <div id="documentsDiv">
              <Documents data={this.props.data} docImages={this.props.docImages} clusterByOptions={this.props.clusterByOptions} documents={this.props.documents} dotLocations={this.state.dotLocations} dotColors={this.props.colors} storyid={this.props.storyid} timelinePresent={true} referenceViewTop={this.props.referenceViewOrder[0]} referenceViewBottom={this.props.referenceViewOrder[1]} />
            </div>

          </div>
        )
      } else {   //there is also a timeline on bottom, so render docs with that timeline
        return (
            <div id="timeline1"/>
        )
      }
    
    } else //this.props.isUpper == false
    {
      //console.log("rendering timelines2 and docs");
      //console.log(this.state.dotLocations);

      return (
        <div id="timelines">

          <div id="timeline2" />

          <div id="documentsDiv">
            <Documents data={this.props.data} docImages={this.props.docImages} clusterByOptions={this.props.clusterByOptions} documents={this.props.documents} dotLocations={this.state.dotLocations} dotColors={this.props.colors} storyid={this.props.storyid} timelinePresent={true} referenceViewTop={this.props.referenceViewOrder[0]} referenceViewBottom={this.props.referenceViewOrder[1]} />
          </div>

        </div>
      )
    }
  }
}