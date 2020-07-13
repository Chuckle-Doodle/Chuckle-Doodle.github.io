import React from 'react';
import drawTimeline from './helpers.js';
import Documents from './documents.jsx';
import '../static/css/style.css'; 

export default class Timeline extends React.Component {

  constructor(props) {
    super(props);
    //var chart = drawTimeline(this.props);
    this.chart = null;
    this.dotLocations = [];
    this.state = {
      //dotLocations: [],
      render: false,
    };
    
  }

  componentDidMount() {
    //console.log("drawing timeline comp did mount");
    this.chart = drawTimeline(this.props);
    //this.setState(
      //{
        //dotLocations: this.chart.dotInfo["locations"],
      //}
    //);
    this.dotLocations = this.chart.dotInfo["locations"];
    setTimeout(function() { //Start the timer
      this.setState({render: true}) //After 4 second, set render to true
    }.bind(this), 0)

  }
  

  componentDidUpdate(prevProps) {
    console.log("comp diid updagte in timeline.jsx");
    console.log(this.props);
    var tempProps = this.props;
    console.log(tempProps);
    //var dotLocations = drawTimeline2(this.props);
    //if ((prevProps.colorBy != this.props.colorBy) || (prevProps.colorBy == "Cluster" && prevProps.clusterBy == "Document ID" && this.props.clusterBy != "Document ID"))
    if ((prevProps.colorBy != this.props.colorBy) || (prevProps.colorBy == "Cluster" && prevProps.clusterBy == "Document ID" && this.props.clusterBy != "Document ID") || (this.props.clusterBy == "Document ID"))
    {
      console.log("case 1");
      this.state.render = false;

      //for some reason i need this options thing for the timeline colors to update
      this.chart.options([
        //dotColor: function (d, i) {
                //return (this.props.colorBy == "Document ID" || this.props.clusterBy == "Document ID" ? this.props.colors[i] : this.props.colors[this.props.colors.length - 1 - this.props.imageOrder.clusterOrder[i]]);
            //}
        //this.chart._state.options.dotColor: "blue"
      ]);

      //var tempProps = this.props;
      //console.log("current props are case 1");
      //console.log(tempProps);
      
      this.chart._state.options.labelBgColor = function (d, i) {
        return ((tempProps.colorBy == "Document ID" || tempProps.clusterBy == "Document ID") ? tempProps.colors[i] : tempProps.colors[tempProps.colors.length - 1 - tempProps.imageOrder.clusterOrder[i + 1]]);
      };

      this.chart._state.options.dotColor = function (d, i) {
        return ((tempProps.colorBy == "Document ID" || tempProps.clusterBy == "Document ID") ? tempProps.colors[i] : tempProps.colors[tempProps.colors.length - 1 - tempProps.imageOrder.clusterOrder[i + 1]]);
      };

      this.chart._state.options.linkColor = function (d, i) {
        return ((tempProps.colorBy == "Document ID" || tempProps.clusterBy == "Document ID") ? tempProps.colors[i] : tempProps.colors[tempProps.colors.length - 1 - tempProps.imageOrder.clusterOrder[i + 1]]);
      };

      //this.setState(
        //{
          //dotLocations: this.chart.dotInfo["locations"],
        //}
      //);

      //setTimeout(function() { //Start the timer
        //this.setState({render: true}) //After 4 second, set render to true
      //}.bind(this), 4000)

    } else
    {
      for (var key in prevProps.imageOrder.clusterOrder)
      {
        if (prevProps.imageOrder.clusterOrder[key] != this.props.imageOrder.clusterOrder[key])
        {
              //console.log("HIT!");
            console.log("case 2");
          this.state.render = false;

          this.chart.options([
        //dotColor: function (d, i) {
                //return (this.props.colorBy == "Document ID" || this.props.clusterBy == "Document ID" ? this.props.colors[i] : this.props.colors[this.props.colors.length - 1 - this.props.imageOrder.clusterOrder[i]]);
            //}
        //this.chart._state.options.dotColor: "blue"
          ]);

          //var tempProps = this.props;
          //console.log("current props are case 2");
          //console.log(tempProps);
      
          this.chart._state.options.labelBgColor = function (d, i) {
            return ((tempProps.colorBy == "Document ID" || tempProps.clusterBy == "Document ID") ? tempProps.colors[i] : tempProps.colors[tempProps.colors.length - 1 - tempProps.imageOrder.clusterOrder[i + 1]]);
          };

          this.chart._state.options.dotColor = function (d, i) {
            return ((tempProps.colorBy == "Document ID" || tempProps.clusterBy == "Document ID") ? tempProps.colors[i] : tempProps.colors[tempProps.colors.length - 1 - tempProps.imageOrder.clusterOrder[i + 1]]);
          };

          this.chart._state.options.linkColor = function (d, i) {
            return ((tempProps.colorBy == "Document ID" || tempProps.clusterBy == "Document ID") ? tempProps.colors[i] : tempProps.colors[tempProps.colors.length - 1 - tempProps.imageOrder.clusterOrder[i + 1]]);
          };

          //this.setState(
            //{
              //dotLocations: this.chart.dotInfo["locations"],
            //} 
          //);

          //this set timeout part doesn't appear to be necessary. CNG 7.13.20
          //setTimeout(function() { //Start the timer
            //this.setState({render: true}) //After 4 second, set render to true
          //}.bind(this), 75)
          break;
        }
      }
    }
  }

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

    if (this.dotLocations.length == 0)
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

    if (this.props.isUpper == true)
    {
      if (this.props.referenceViewOrder[1] != "Timeline")
      {
        return (
          <div id="timelines">

            <div id="timeline1" />

            <div id="documentsDiv">
              <Documents data={this.props.data} docImages={this.props.docImages} clusterByOptions={this.props.clusterByOptions} documents={this.props.documents} dotLocations={this.dotLocations} colors={this.props.colors} storyid={this.props.storyid} timelinePresent={true} referenceViewTop={this.props.referenceViewOrder[0]} referenceViewBottom={this.props.referenceViewOrder[1]} imageOrder={this.props.imageOrder} clusterBy={this.props.clusterBy} colorBy={this.props.colorBy} />
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

      return (
        <div id="timelines">

          <div id="timeline2" />

          <div id="documentsDiv">
            <Documents data={this.props.data} docImages={this.props.docImages} clusterByOptions={this.props.clusterByOptions} documents={this.props.documents} dotLocations={this.dotLocations} colors={this.props.colors} storyid={this.props.storyid} timelinePresent={true} referenceViewTop={this.props.referenceViewOrder[0]} referenceViewBottom={this.props.referenceViewOrder[1]} imageOrder={this.props.imageOrder} clusterBy={this.props.clusterBy} colorBy={this.props.colorBy} />
          </div>

        </div>
      )
    }
  }
}