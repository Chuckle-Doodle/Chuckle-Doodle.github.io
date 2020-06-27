import React from 'react';
import Timeline from './timeline.jsx';
import Map from './map.jsx'
import fetch from 'isomorphic-fetch';
//import Map from './map.js';
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

    //find out which type of ReferenceView we have, timeline or map
    const refViewType = this.props.type;
    // var colors = ["blue", "goldenrod", "fuchsia", "green", "burlywood", "crimson", "lightslategray", "red"];
    var colors = ["blue", "yellow", "purple", "green", "orange", "brown", "gray", "red"];


    return (
      <div>
        <div>

          {refViewType == "Timeline" ? (
              <Timeline docImages={this.props.docImages} viewName={this.props.viewName} clusterBy={this.props.clusterBy} dataUrl={this.props.dataUrl} data={this.props.data} documents={this.props.documents} question={this.props.question} isUpper={this.props.isUpper} storyid={this.props.storyid} referenceViewOrder={this.props.referenceViewOrder} colors={colors} />
            ) : (
              <Map docImages={this.props.docImages} viewName={this.props.viewName} clusterBy={this.props.clusterBy} dataUrl={this.props.dataUrl} data={this.props.data} documents={this.props.documents} question={this.props.question} isUpper={this.props.isUpper} referenceViewOrder={this.props.referenceViewOrder} colors={colors} />
            )
          }
        </div>

      </div>
    );
  }
}
