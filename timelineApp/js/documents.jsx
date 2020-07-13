import React from 'react';
import fetch from 'isomorphic-fetch';
//import Timeline from './timeline.js';
//import * as utils from './docCluster.js';
import Document from './document.jsx';
import '../static/css/style.css'; 

export default class Documents extends React.Component {
  constructor(props) {
    super(props);
/*
    var initialSpaceOrder = [];
    var initialClusterOrder = {};
    for (var i = 0; i < this.props.documents.length; i++) {
      initialSpaceOrder.push(this.props.documents[i].docID);
      initialClusterOrder[this.props.documents[i].docID] = i;
    }

    this.state = {
        imageOrder: {
            clusterOrder: initialClusterOrder,
            documentOrder: this.props.docImages,
            spaceOrder: initialSpaceOrder
        },
        clusterBy: 'Document ID',
        //colorOrder: this.props.dotColors,
        colorBy: 'Document ID',
    };
    */

    //this.changeClusterBy = this.changeClusterBy.bind(this);
    //this.changeColorBy = this.changeColorBy.bind(this);
  }

/*
  componentDidUpdate() {
    // updates the border colors according to cluster
    for (let i = 0; i < this.props.documents.length; i++) {
        var image = document.getElementById("image" + (i + 1));
        image.style.borderColor = this.state.colorOrder[i];
    }
}
*/

/*
changeClusterBy (event) {

  this.setState({
    imageOrder: utils.cluster(this.props.data, event.target.value, this.props.documents),
    clusterBy: event.target.value
  });

}

changeColorBy (event) {
  this.setState({
    //imageOrder: utils.cluster(this.props.data, event.target.value, this.props.documents),
    colorBy: event.target.value
  });
}
*/

  render() {
    //console.log("printing cluster order !!!");
    //console.log(this.state.imageOrder);
    //console.log(this.state.imageOrder.clusterOrder);
    //if (!this.state.imageOrder.clusterOrder) {
      //return <div />
    //}
    //update order of docs on screen each time state (aka document order) changes
    //console.log("about to render documents");

    //check if there are timelines or not

    //establish colors for each document:
    //ex/ for doc ID default: [0,1,2,3] represents first 4 colors in props.colors list
    //ex/ [0,0,1,1] means there are two clusters, the first taking the first color, the second taking the second
    /*
    var colorOrder = [0,0,0,0];  //default value
    let counter = 0;
    let counter2 = 0;
    endOfCluster={this.state.imageOrder.spaceOrder.indexOf(imageData[1]) > -1 ? true : false}
    for (let i = 0; i < this.state.imageOrder.spaceOrder.length; i++) {

      if (this.state.imageOrder.spaceOrder.indexOf()) {
  
        for (let j = i; j < this.state.imageOrder.spaceOrder[i]; j++) {
          colorOrder[j] = colorOrder[j] + 1;
        }

      }

    }

    while (counter <= this.state.imageOrder.spaceOrder[counter2]) {

      counter++;
    }

    console.log("colorOrder is: ", colorOrder);
    */
    //console.log("printing props");
    //console.log(this.props);

    if (this.props.timelinePresent)
    {
      //console.log("colors are: ", this.props.colors);
      //console.log("image order is: ");
      //console.log(this.state.imageOrder);
      //console.log(this.state.imageOrder.documentOrder);
      //console.log("colorBy: ", this.state.colorBy);

      //console.log("printing state!");
      //console.log(this.state.imageOrder);
      //console.log(this.state.imageOrder.documentOrder);
      //console.log(this.state.imageOrder.documentOrder[0]);
      //console.log(this.state.imageOrder.documentOrder[0][0]);

      return (

        <div className="Documents">

          <div id="DocumentArray">
            {this.props.imageOrder.documentOrder.map((imageData, index) =>
              <Document image={imageData[0]} documentid={imageData[1]} imageName={"image" + imageData[1]} endOfCluster={this.props.imageOrder.spaceOrder.indexOf(imageData[1]) > -1 ? true : false} dotLocationTop={this.props.referenceViewTop == "Timeline" ? this.props.dotLocations[imageData[1] - 1] : null} dotLocationBottom={this.props.referenceViewBottom == "Timeline" ? this.props.dotLocations[this.props.dotLocations.length - 1 - 4 + imageData[1]] : null} color={this.props.colorBy == "Document ID" ? this.props.colors[imageData[1] - 1] : (this.props.clusterBy == "Document ID" ? this.props.colors[imageData[1] - 1] : this.props.colors[this.props.colors.length - 1 - this.props.imageOrder.clusterOrder[imageData[1]]])} storyid={this.props.storyid} referenceViewTop={this.props.referenceViewTop} referenceViewBottom={this.props.referenceViewBottom} />
            )}
          </div>

        </div>
      );
    } else  //no timeline present. so don't need to render docs with lines
    {
      return (

        <div className="Documents">

          <div id="DocumentArray">
            {this.props.imageOrder.documentOrder.map((imageData, index) =>
              <Document image={imageData[0]} documentid={imageData[1]} imageName={"image" + imageData[1]} endOfCluster={this.props.imageOrder.spaceOrder.indexOf(imageData[1]) > -1 ? true : false} color={this.props.colorBy == "Document ID" ? this.props.colors[imageData[1] - 1] : (this.props.clusterBy == "Document ID" ? this.props.colors[imageData[1] - 1] : this.props.colors[this.props.colors.length - 1 - this.props.imageOrder.clusterOrder[imageData[1]]])} storyid={this.props.storyid} referenceViewTop={this.props.referenceViewTop} referenceViewBottom={this.props.referenceViewBottom} />
            )}
          </div>

        </div>
      );
    }

  }
}
/*
          <button className="button" value="docID" onClick={() => this.setState({
              imageOrder: utils.cluster(this.props.data, 'docID', this.props.documents),
              clusterBy: 'Document ID'
          })}> 
            Cluster by Document ID (default)
          </button>

          {this.props.clusterByOptions.map((option) =>

            <button className="button" value={option} onClick={() => this.setState({
              imageOrder: utils.cluster(this.props.data, option, this.props.documents),
              clusterBy: option
            })}>
              Cluster by: {option}
            </button>

          )}



          {this.props.dotColors.map((color) =>

            <button className="button" value={color} onClick={() => this.setState({
              imageOrder: utils.cluster(this.props.data, option, this.props.documents),
              clusterBy: option
            })}>
              Color by: {color}
            </button>

          )}
*/

//colorOrder: utils.clusterColors(this.props.data, 'docID', this.props.documents, this.props.dotColors)
//colorOrder: utils.clusterColors(this.props.data, this.props.clusterBy, this.props.documents, this.props.dotColors)


/* gotten rid of 7.12.20
            Cluster by:
            <select id="clusterByList" name="clusterByList" onChange={this.changeClusterBy} value={this.state.clusterBy} >
                {this.props.clusterByOptions.map((clusterByOption, index) =>
                  <option value={clusterByOption}>
                    {clusterByOption}
                  </option>


                )}
            </select>

            <div onChange={this.changeColorBy}>
              Color by:
              <input type="radio" value="Document ID" name="colorByOption" defaultChecked/> Document ID
              <input type="radio" value="Cluster" name="colorByOption"/> Cluster
            </div>




          <button className="button" value="docID" onClick={() => this.setState({
              imageOrder: utils.cluster(this.props.data, 'docID', this.props.documents),
              clusterBy: 'Document ID'
          })}> 
            Cluster by Document ID (default)
          </button>

          {this.props.clusterByOptions.map((option) =>

            <button className="button" value={option} onClick={() => this.setState({
              imageOrder: utils.cluster(this.props.data, option, this.props.documents),
              clusterBy: option
            })}>
              Cluster by: {option}
            </button>

          )}

          <div id="clusteringByText">
            Clustering by: {this.state.clusterBy}
          </div>

*/