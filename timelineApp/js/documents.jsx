import React from 'react';
import fetch from 'isomorphic-fetch';
//import Timeline from './timeline.js';
import * as utils from './docCluster.js';
import Document from './document.jsx';
import '../static/css/style.css'; 

export default class Documents extends React.Component {
  constructor(props) {
    super(props);
    //var x = this.props.clusterBy;
    //console.log("clusterBy prop in the clusterbutton comp!" + x);
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

  //removeElement() {
      //var elem = document.getElementById("0");
      //return elem.parentNode.removeChild(elem);
  //}

  render() {
    //update order of docs on screen each time state (aka document order) changes

    //this will be the array we use to actually render the images in proper order
    /*
    var imageOrder = [];
    var blankImage = "https://images-wixmp-530a50041672c69d335ba4cf.wixmp.com/templates/image/b77fe464cfc445da9003a5383a3e1acf.jpg";


    //iterate through current docOrder
    for (let i = 0; i < this.state.documentOrder.length; i++)
    {
      //console.log(this.state.documentOrder[i]);
      //if elem is a space
      if (this.state.documentOrder[i] == "space")
      {
        imageOrder.push(blankImage);
      } 
      else //push image to the imageOrder array
      {
        imageOrder.push(this.props.data[this.state.documentOrder[i] - 1]["Frontcover"]);
      }
    }
    */

    return (

      <div className="Documents">

        <div>
          {this.state.imageOrder.documentOrder.map((imageData, index) =>
            //instead of rendering img here, render Document component as child of Documents component.
            //There will be one Document component per image. Each will contain:
            //img like the current one, line connecting mid top of image to corresponding dot on both timelines
            //props = image, this.props.dotLocations[index], this.props.dotLocations[index+4] if exists
            //state = N/A MAKE FUNCTIONAL COMPONENT
            //2 lines: one from mid top image to this.props.dotLocations[index]
            //        another from mid bottom image to this.props.dotLocations[index+4]
            //each line needs 4 points: 
            //each dotLocation is DOMRect object. contains x and y attributes that APPEAR to be absolute positioned in browser window
            //to get absolute position of image, do getBoundingClientRect(). this should get you upper left coordinates.
            // first draw line from upper left to test!!
            <Document image={imageData[0]} endOfCluster={this.state.imageOrder.spaceOrder.indexOf(imageData[1]) > -1 ? true : false} dotLocationTop={this.props.dotLocations[index]} dotLocationBottom={this.props.dotLocations[index + 4]} />
          )}
        </div>

        <button value="docID" onClick={() => this.setState({
            imageOrder: utils.cluster(this.props.data, 'docID', this.props.documents),
            clusterBy: 'docID'
        })}> 
          Cluster by Document ID
        </button>

        <button value={this.props.clusterBy} onClick={() => this.setState({
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