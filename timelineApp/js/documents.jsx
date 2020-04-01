import React from 'react';
import fetch from 'isomorphic-fetch';
//import Timeline from './timeline.js';
import * as utils from '../../docClusterDemo/docCluster.js'; 

export default class Documents extends React.Component {
  constructor(props) {
    super(props);
    //var x = this.props.clusterBy;
    //console.log("clusterBy prop in the clusterbutton comp!" + x);
    this.state = {
      imageOrder: this.props.docImages,
      //documentOrder: [1, "space", 2, "space", 3, "space", 4],
      clusterBy: 'docID',
    };
    //this.removeElement = this.removeElement.bind(this);
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

    //if (!this.state.imageOrder) {
      //return <div />
    //}

    return (

      <div className="Documents">

        <div>
          {this.state.imageOrder.map((image, index) =>
            <img id={index} src={image} alt="Picture of Document" height="200" width="150"></img>
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