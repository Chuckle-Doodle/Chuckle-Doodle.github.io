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
        //console.log("in compDiDMount");
        //var x1 = this.imageElement.getBoundingClientRect().x;
        //var y1 = this.imageElement.getBoundingClientRect().y;
        //console.log(x1, y1);
        this.setState(
            {
                xPos: this.imageElement.getBoundingClientRect().x,
                yPos: this.imageElement.getBoundingClientRect().y,
            }
        );
    }

    componentDidUpdate(prevProps, prevState) {
        //console.log("in compDiDUpdate");
        //console.log(prevState.xPos, prevState.yPos);
        //console.log();
        if (prevState.xPos == null) {
            return;
        }
        if (prevState.xPos != this.imageElement.getBoundingClientRect().x || prevState.yPos != this.imageElement.getBoundingClientRect().y + 310) {
            //var x1 = this.imageElement.getBoundingClientRect().x;
            //var y1 = this.imageElement.getBoundingClientRect().y;
            //console.log("state is different !!!");
            //console.log(this.imageElement.getBoundingClientRect().x);
            //console.log(this.imageElement.getBoundingClientRect().y);
            this.setState(
                {
                    xPos: this.imageElement.getBoundingClientRect().x,
                    yPos: this.imageElement.getBoundingClientRect().y + 310,
                }
            );
        }
    }


    render() {

        var margin = 0;
        if (this.props.endOfCluster == true) {
            margin = 150;
        }

        if (this.state.xPos == null) {

            return (
                <img src={this.props.image} id={this.props.imageName} style={{ marginRight: margin + 'px' }} alt="Picture of Document" height="200" width="150" ref={this.setImageRef} ></img>

            );

        } else {
            //console.log("rendering document image and lines");
            //console.log(this.state.xPos, this.state.yPos);
            return (
                <div id={"Document" + this.props.documentid}>
                    <a href={"/3#" + this.props.documentid}>
                        <img id={this.props.imageName} src={this.props.image} style={{ marginRight: margin + 'px' }} alt="Picture of Document" height="200" width="150" ref={this.setImageRef} ></img>
                    </a>
                    <svg id={"svgLine" + this.props.documentid} width="4000" height="4000">
                        <line x1={this.state.xPos} y1={this.state.yPos - 300} x2={this.props.dotLocationTop.x} y2={this.props.dotLocationTop.y - 300} style={{ stroke: this.props.lineColor, strokeWidth: "3" }} />
                        {/* <line x1={this.state.xPos} y1={this.state.yPos - 100} x2={this.props.dotLocationBottom.x} y2={this.props.dotLocationBottom.y - 300} style={{ stroke: this.props.lineColor, strokeWidth: "3" }} /> */}
                    </svg>

                    <svg id={"svgLineBottom" + this.props.documentid} width="4000" height="4000">
                        <line x1={this.state.xPos} y1={this.state.yPos - 100} x2={this.props.dotLocationBottom.x} y2={this.props.dotLocationBottom.y - 300} style={{ stroke: this.props.lineColor, strokeWidth: "3" }} />
                    </svg>

                </div>

            );

        }
    }
}