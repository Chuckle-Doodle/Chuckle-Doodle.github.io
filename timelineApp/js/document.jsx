import React from 'react';

export default class Document extends React.Component {
  constructor(props) {

    super(props);
    this.imageElement = null;
    
    this.state = {
      xPos: null,
      yPos: null,
    };
    

    this.setImageRef = element => {
      console.log("setting image Ref !");
      this.imageElement = element;
    };

    this.getImageRef = () => {
      if (this.imageElement) {
        return this.imageElement.getBoundingClientRect();
      }
    };

  }

  
  componentDidMount() {
    // Runs when an instance is added to the DOM
    var x1 = this.imageElement.getBoundingClientRect().x;
    var y1 = this.imageElement.getBoundingClientRect().y;
    this.setState(
      {
        xPos: x1,
        yPos: y1,
      }
    );
    console.log(this.state.xPos, this.state.yPos);
    
  }
  

  render() {

    var margin = 0;
    if (this.props.endOfCluster == true) {
      margin = 150;
    }

    if (this.state.xPos == null) {
      console.log("this.state is NULL");
      return (
        <img src={this.props.image} id={this.props.imageName} style={{marginRight: margin + 'px'}} alt="Picture of Document" height="200" width="150" ref={this.setImageRef} ></img>

      );

    } else {
      console.log("this.state is NOT NULL");
      console.log(this.props.lineColor, this.props.documentid, this.state.xPos, this.state.yPos, this.props.dotLocationTop.x, this.props.dotLocationTop.y);
      return (
        <div id={"Document" + this.props.documentid}>
          <img id={this.props.imageName} src={this.props.image} style={{marginRight: margin + 'px'}} alt="Picture of Document" height="200" width="150" ref={this.setImageRef} ></img>
          <svg id={"svgLine" + this.props.documentid} width="4000" height="4000">
            <line x1={this.state.xPos} y1={this.state.yPos - 300} x2={this.props.dotLocationTop.x} y2={this.props.dotLocationTop.y - 300} style={{stroke:this.props.lineColor, strokeWidth:"3"}} />
            <line x1={this.state.xPos} y1={this.state.yPos - 100} x2={this.props.dotLocationBottom.x} y2={this.props.dotLocationBottom.y - 300} style={{stroke:this.props.lineColor, strokeWidth:"3"}} />
          </svg>
        </div>

      );

    }
  }
}