import React from 'react';
import Timeline from './timeline.jsx';
import Map from './map.jsx'
import fetch from 'isomorphic-fetch';
//import Map from './map.js';
import '../static/css/style.css';

export default class ReferenceView extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.wait > 0)
    {
      this.state = {
        render: false,
      };
    } else
    {
      this.state = {
        render: true,
      };
    }


  }

  
  componentDidMount() {

    setTimeout(function() { //Start the timer
      this.setState({render: true}) //After 4 second, set render to true
    }.bind(this), this.props.wait);

  }


  render() {
    //console.log(this.state.render, this.props.wait, "top of render!");
    //console.log(this.props.isUpper, "isUpper", this.state.render);
    if (this.state.render == false)
    {
      console.log("render is false!");
      return <div/>
    }
    //console.log("render is true!", this.props.isUpper);

    //find out which type of ReferenceView we have, timeline or map
    const refViewType = this.props.type;
    // var colors = ["blue", "goldenrod", "fuchsia", "green", "burlywood", "crimson", "lightslategray", "red"];
    var colors = ["blue", "gray", "green", "red", "orange", "brown", "purple"];


    return (
      <div>
        <div>

          {refViewType == "Timeline" ? (
              <div>
                <Timeline docImages={this.props.docImages} viewName={this.props.viewName} clusterByOptions={this.props.clusterByOptions} dataUrl={this.props.dataUrl} data={this.props.data} documents={this.props.documents} question={this.props.question} isUpper={this.props.isUpper} storyid={this.props.storyid} referenceViewOrder={this.props.referenceViewOrder} colors={colors} imageOrder={this.props.imageOrder} clusterBy={this.props.clusterBy} colorBy={this.props.colorBy} />
              </div>
            ) : (
              <div>
                <Map docImages={this.props.docImages} viewName={this.props.viewName} clusterByOptions={this.props.clusterByOptions} dataUrl={this.props.dataUrl} data={this.props.data} documents={this.props.documents} question={this.props.question} isUpper={this.props.isUpper} referenceViewOrder={this.props.referenceViewOrder} colors={colors} imageOrder={this.props.imageOrder} clusterBy={this.props.clusterBy} colorBy={this.props.colorBy}  answersPerCluster={this.props.answersPerCluster} clusterNumbers={this.props.clusterNumbers} />
              </div>
            )
          }
        </div>

      </div>
    );
  }
}
