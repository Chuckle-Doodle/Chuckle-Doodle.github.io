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
    console.log("compDidMount");
    //console.log("drawing timeline comp did mount");
    this.chart = drawTimeline(this.props);
    //this.setState(
      //{
        //dotLocations: this.chart.dotInfo["locations"],
      //}
    //);
    this.dotLocations = this.chart.dotInfo["locations"];
    /*
    if (this.props.referenceViewOrder[0] == "Map" && this.props.referenceViewOrder[1] == "Timeline")
    {
      setTimeout(function() { //Start the timer
        this.setState({render: true}) //After 3 second, set render to true
      }.bind(this), 3)
    } else
    {
        setTimeout(function() { //Start the timer
          this.setState({render: true}) //After 0 second, set render to true
        }.bind(this), 0)
    }
  */
          setTimeout(function() { //Start the timer
          this.setState({render: true}) //After 0 second, set render to true
        }.bind(this), 0)
  }
  

  componentDidUpdate(prevProps) {
    console.log("comp Did update");
    var tempProps = this.props;
    if ((prevProps.colorBy != this.props.colorBy) || (prevProps.colorBy == "Cluster" && prevProps.clusterBy == "Document ID" && this.props.clusterBy != "Document ID") || (this.props.clusterBy == "Document ID"))
    {
      this.state.render = false;

      //for some reason i need this options thing for the timeline colors to update
      this.chart.options([
        //dotColor: function (d, i) {
                //return (this.props.colorBy == "Document ID" || this.props.clusterBy == "Document ID" ? this.props.colors[i] : this.props.colors[this.props.colors.length - 1 - this.props.imageOrder.clusterOrder[i]]);
            //}
        //this.chart._state.options.dotColor: "blue"
      ]);
      
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
          this.state.render = false;

          this.chart.options([
        //dotColor: function (d, i) {
                //return (this.props.colorBy == "Document ID" || this.props.clusterBy == "Document ID" ? this.props.colors[i] : this.props.colors[this.props.colors.length - 1 - this.props.imageOrder.clusterOrder[i]]);
            //}
        //this.chart._state.options.dotColor: "blue"
          ]);
      
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
    //console.log("rendering timeline");
    //if (this.state.render == false)
    //{
      //return <div/>
    //}
/*
    if (this.props.referenceViewOrder[0] == "Map" && this.props.referenceViewOrder[1] == "Timeline")
    {
      if (this.state.render == false)
      {
        console.log("this.state.render is false!");
        return (
          <div id="timelines">


            <svg id="svgTimeline2" width="100%" height="100%">

            </svg>

            <div id="timeline2" />

            <div id="documentsDiv" />

          </div>
        );
      }
    }
*/
    if (this.dotLocations.length == 0)
    {
      if (this.props.isUpper == true)
      {
        return (
          <div id="timelines">

            <div id="timeline1" />

            <svg id="svgTimeline1" width="100%" height="100%">

            </svg>

          </div>
        )
      } else
      {
        console.log("dot locations zero");
        //need to add svg here too? ??
//TODO: SET PAUSE HERE TO WAIT FOR MAP TO RENDER !!!

        return (
          <div id="timelines">

            <svg id="svgTimeline2" width="100%" height="100%">

            </svg>

            <div id="timeline2" />

            <div id="documentsDiv" />


          </div>
        );
      }
    }
    //console.log("dotLocations:");
    //console.log(this.dotLocations);
    if (this.props.isUpper == true)
    {
      if (this.props.referenceViewOrder[1] != "Timeline")
      {
        return (
          <div id="timelines">

            <div id="timeline1" />

            <svg id="svgTimeline1" width="100%" height="100%">

            </svg>

            <div id="documentsDiv">
              <Documents data={this.props.data} docImages={this.props.docImages} clusterByOptions={this.props.clusterByOptions} documents={this.props.documents} dotLocations={this.dotLocations} colors={this.props.colors} storyid={this.props.storyid} timelinePresent={true} referenceViewTop={this.props.referenceViewOrder[0]} referenceViewBottom={this.props.referenceViewOrder[1]} imageOrder={this.props.imageOrder} clusterBy={this.props.clusterBy} colorBy={this.props.colorBy} />
            </div>

          </div>
        )
      } else {   //there is also a timeline on bottom, so render docs with that timeline
        return (
          <div id="timelines">

            <div id="timeline1" />

            <svg id="svgTimeline1" width="100%" height="100%">

            </svg>

          </div>
        )
      }
    
    } else //this.props.isUpper == false
    {
      //need to add svg here too ???
      //console.log("bottom part render");
      return (
        <div id="timelines">

          <svg id="svgTimeline2" width="100%" height="100%">

          </svg>

          <div id="timeline2" />

          <div id="documentsDiv">
            <Documents data={this.props.data} docImages={this.props.docImages} clusterByOptions={this.props.clusterByOptions} documents={this.props.documents} dotLocations={this.dotLocations} colors={this.props.colors} storyid={this.props.storyid} timelinePresent={true} referenceViewTop={this.props.referenceViewOrder[0]} referenceViewBottom={this.props.referenceViewOrder[1]} imageOrder={this.props.imageOrder} clusterBy={this.props.clusterBy} colorBy={this.props.colorBy} />
          </div>

        </div>
      )
    }
  }
}