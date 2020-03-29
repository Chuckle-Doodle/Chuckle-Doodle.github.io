import React from 'react';
import fetch from 'isomorphic-fetch';
import Timeline from './timeline.js';
import * as utils from '../../docClusterDemo/docCluster.js'; 

export default class ReferenceView extends React.Component {
  constructor(props) {
    super(props);
    //var x = this.props.clusterBy;
    //console.log("clusterBy prop in the clusterbutton comp!" + x);
    this.state = {
      currentClusterBy: this.props.clusterBy,   //state clusterBy dictates by what metric the data is being clustered. this changes!
    };

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
    //console.log("beginning of render func in clusterButton.jsx");
    //console.log(this.props.clusterBy);
    //console.log(this.props.documents);

    return (
      <div className="ClusterButton">

        <button value="docID" onClick={() => utils.cluster('docID', this.props.documents)} > Cluster by Document ID</button>
        <button value={this.props.clusterBy} onClick={() => utils.cluster(this.props.clusterBy, this.props.documents)} > Cluster by {this.props.clusterBy}</button>

        <div>
          Clustering by: {this.props.clusterBy}  have this alternate with current cluster option
        </div>

      </div>
    );
  }
}