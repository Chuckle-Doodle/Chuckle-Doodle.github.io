import React from 'react';
import fetch from 'isomorphic-fetch';
//import Timeline from './timeline.js';
import * as utils from './docCluster.js';
import Document from './document.jsx';
import '../static/css/style.css'; 

export default class Documents extends React.Component {
  constructor(props) {
    super(props);

    var initialSpaceOrder = [];
    for (var i = 0; i < this.props.documents.length; i++) {
      initialSpaceOrder.push(this.props.documents[i].docID);
    }

    this.state = {
      imageOrder: {
        documentOrder: this.props.docImages,
        spaceOrder: initialSpaceOrder
      },
      clusterBy: 'Document ID',
    };

  }


  render() {
    //update order of docs on screen each time state (aka document order) changes
    //console.log("about to render documents");

    //check if there are timelines or not
    if (this.props.timelinePresent)
    {
      return (

        <div className="Documents">

          <div id="DocumentArray">
            {this.state.imageOrder.documentOrder.map((imageData, index) =>
              <Document image={imageData[0]} documentid={imageData[1]} imageName={"image" + imageData[1]} endOfCluster={this.state.imageOrder.spaceOrder.indexOf(imageData[1]) > -1 ? true : false} dotLocationTop={this.props.referenceViewTop == "Timeline" ? this.props.dotLocations[imageData[1] - 1] : null} dotLocationBottom={this.props.referenceViewBottom == "Timeline" ? this.props.dotLocations[this.props.dotLocations.length - 1 - 4 + imageData[1]] : null} lineColor={this.props.dotColors[imageData[1] - 1]} storyid={this.props.storyid} referenceViewTop={this.props.referenceViewTop} referenceViewBottom={this.props.referenceViewBottom} />
            )}
          </div>

          <button className="button" value="docID" onClick={() => this.setState({
              imageOrder: utils.cluster(this.props.data, 'docID', this.props.documents),
              clusterBy: 'Document ID'
          })}> 
            Cluster by Document ID
          </button>

          <button className="button" value={this.props.clusterBy} onClick={() => this.setState({
              imageOrder: utils.cluster(this.props.data, this.props.clusterBy, this.props.documents),
              clusterBy: this.props.clusterBy
          })}> 
            Cluster by {this.props.clusterBy}
          </button>

          <div id="clusteringByText">
            Clustering by: {this.state.clusterBy}
          </div>

        </div>
      );
    } else  //no timeline present. so don't need to render docs with lines
    {
      return (

        <div className="Documents">

          <div id="DocumentArray">
            {this.state.imageOrder.documentOrder.map((imageData, index) =>
              <Document image={imageData[0]} documentid={imageData[1]} imageName={"image" + imageData[1]} endOfCluster={this.state.imageOrder.spaceOrder.indexOf(imageData[1]) > -1 ? true : false} lineColor={this.props.dotColors[imageData[1] - 1]} storyid={this.props.storyid} referenceViewTop={this.props.referenceViewTop} referenceViewBottom={this.props.referenceViewBottom} />
            )}
          </div>

          <button className="button" value="docID" onClick={() => this.setState({
              imageOrder: utils.cluster(this.props.data, 'docID', this.props.documents),
              clusterBy: 'Document ID'
          })}> 
            Cluster by Document ID
          </button>

          <button className="button" value={this.props.clusterBy} onClick={() => this.setState({
              imageOrder: utils.cluster(this.props.data, this.props.clusterBy, this.props.documents),
              clusterBy: this.props.clusterBy
          })}> 
            Cluster by {this.props.clusterBy}
          </button>

          <div id="clusteringByText">
            Clustering by: {this.state.clusterBy}
          </div>

        </div>
      );
    }

  }
}