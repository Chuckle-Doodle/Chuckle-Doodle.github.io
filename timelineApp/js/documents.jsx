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
      clusterBy: 'docID',
    };

  }


  render() {
    //update order of docs on screen each time state (aka document order) changes

    return (

      <div className="Documents">

        <div id="DocumentArray">
          {this.state.imageOrder.documentOrder.map((imageData, index) =>
            <Document image={imageData[0]} documentid={imageData[1]} imageName={"image" + imageData[1]} endOfCluster={this.state.imageOrder.spaceOrder.indexOf(imageData[1]) > -1 ? true : false} dotLocationTop={this.props.dotLocations[imageData[1] - 1]} dotLocationBottom={this.props.dotLocations[imageData[1] - 1 + 4]} lineColor={this.props.dotColors[imageData[1] - 1]} />
          )}
        </div>

        <button className="button" value="docID" onClick={() => this.setState({
            imageOrder: utils.cluster(this.props.data, 'docID', this.props.documents),
            clusterBy: 'docID'
        })}> 
          Cluster by Document ID
        </button>

        <button className="button" value={this.props.clusterBy} onClick={() => this.setState({
            imageOrder: utils.cluster(this.props.data, this.props.clusterBy, this.props.documents),
            clusterBy: this.props.clusterBy
        })}> 
          Cluster by {this.props.clusterBy}
        </button>

        <div >
          Clustering by: {this.state.clusterBy}
        </div>

      </div>
    );
  }
}