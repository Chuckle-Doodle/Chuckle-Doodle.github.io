import React from 'react';

export default class Document extends React.Component {
    constructor(props) {
        super(props);
        this.imageElement = null;

        this.state = {
            xPos: null,   //approx. coordinates of upper left corner of document
            yPos: null,
        };


        this.setImageRef = element => {
            this.imageElement = element;
        };

        this.getImageRef = () => {
            if (this.imageElement) {
                //console.log(this.imageElement.getBoundingClientRect());
                return this.imageElement.getBoundingClientRect();
            }
        };

    }


    componentDidMount() {
        // Runs when an instance is added to the DOM
        //console.log(this.imageElement.getBoundingClientRect());
        this.setState(
            {
                xPos: this.imageElement.getBoundingClientRect().x,
                yPos: this.imageElement.getBoundingClientRect().y,
            }
        );
    }

    componentDidUpdate(prevProps, prevState) {
        //console.log("running compdidupdate");
        if (prevProps == this.props)
        {
            return;
        }
        if (prevState.xPos == null) {
            return;
        }
        if (prevState.xPos != this.imageElement.getBoundingClientRect().x || prevState.yPos != this.imageElement.getBoundingClientRect().y) {
            //console.log("changing state in compdidupdate");
            this.setState(
                {
                    xPos: this.imageElement.getBoundingClientRect().x,
                    yPos: this.imageElement.getBoundingClientRect().y,
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
                <img src={this.props.image} id={this.props.imageName} style={{ marginRight: margin + 'px', borderColor: this.props.color }} alt="Picture of Document" height="200" width="150" ref={this.setImageRef} ></img>
            );

        } else {

            //4 different cases to return: timeline on top, timeline on bottom, timeline on top and bottom, no timeline

            if (this.props.referenceViewTop == 'Timeline' && this.props.referenceViewBottom == 'Timeline') {

                //use javascript to access svgTimeline1 and svgTimeline2 instead of creating new ones in this component
                var svg = document.getElementById("svgTimeline1");
                if (svg.childNodes.length == 8)
                {

                    var lineTop = document.getElementById("top" + this.props.documentid);
                    var lineBottom = document.getElementById("bottom" + this.props.documentid);

                    lineTop.setAttributeNS(null, 'x1', this.state.xPos);
                    lineTop.setAttributeNS(null, 'y1', this.state.yPos);
                    lineTop.setAttributeNS(null, 'x2', this.props.dotLocationTop.x);
                    lineTop.setAttributeNS(null, 'y2', this.props.dotLocationTop.y - 310);
                    lineTop.setAttributeNS(null, 'stroke', this.props.color);

                    lineBottom.setAttributeNS(null, 'x1', this.state.xPos);
                    lineBottom.setAttributeNS(null, 'y1', this.state.yPos + 200); //+200 so line starts from bottom of doc image
                    lineBottom.setAttributeNS(null, 'x2', this.props.dotLocationBottom.x);
                    lineBottom.setAttributeNS(null, 'y2', this.props.dotLocationBottom.y - 95);
                    lineBottom.setAttributeNS(null, 'stroke', this.props.color);

                } else
                {
                    //console.log("create new");
                    var newLine1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    newLine1.setAttributeNS(null, 'id', "top" + this.props.documentid);
                    newLine1.setAttributeNS(null, 'x1', this.state.xPos);
                    newLine1.setAttributeNS(null, 'y1', this.state.yPos);
                    newLine1.setAttributeNS(null, 'x2', this.props.dotLocationTop.x);
                    newLine1.setAttributeNS(null, 'y2', this.props.dotLocationTop.y - 310);
                    newLine1.setAttributeNS(null, "stroke", this.props.color);
                    newLine1.setAttributeNS(null, "stroke-width", 3);
                    svg.appendChild(newLine1);

                    var newLine2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    newLine2.setAttributeNS(null, 'id', "bottom" + this.props.documentid);
                    newLine2.setAttributeNS(null, 'x1', this.state.xPos);
                    newLine2.setAttributeNS(null, 'y1', this.state.yPos);
                    newLine2.setAttributeNS(null, 'x2', this.props.dotLocationBottom.x);
                    newLine2.setAttributeNS(null, 'y2', this.props.dotLocationBottom.y - 95);
                    newLine2.setAttributeNS(null, "stroke", this.props.color);
                    newLine2.setAttributeNS(null, "stroke-width", 3);
                    svg.appendChild(newLine2);
                }

                return (
                    <div id={"Document" + this.props.documentid}>
                        <a href={"/" + this.props.storyid + "#" + this.props.documentid}>
                            <img id={this.props.imageName} src={this.props.image} style={{ marginRight: margin + 'px', borderColor: this.props.color }} alt="Picture of Document" height="200" width="150" ref={this.setImageRef} ></img>
                        </a>

                    </div >

                );

            } else if (this.props.referenceViewTop == 'Timeline' && this.props.referenceViewBottom == 'Map') {

                var svg = document.getElementById("svgTimeline1");
                if (svg.childNodes.length == 4)
                {

                    var lineTop = document.getElementById("top" + this.props.documentid);

                    lineTop.setAttributeNS(null, 'x1', this.state.xPos);
                    lineTop.setAttributeNS(null, 'y1', this.state.yPos);
                    lineTop.setAttributeNS(null, 'x2', this.props.dotLocationTop.x);
                    lineTop.setAttributeNS(null, 'y2', this.props.dotLocationTop.y - 310);
                    lineTop.setAttributeNS(null, 'stroke', this.props.color);

                } else
                {
                    var newLine1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    newLine1.setAttributeNS(null, 'id', "top" + this.props.documentid);
                    newLine1.setAttributeNS(null, 'x1', this.state.xPos);
                    newLine1.setAttributeNS(null, 'y1', this.state.yPos);
                    newLine1.setAttributeNS(null, 'x2', this.props.dotLocationTop.x);
                    newLine1.setAttributeNS(null, 'y2', this.props.dotLocationTop.y - 310);
                    newLine1.setAttributeNS(null, "stroke", this.props.color);
                    newLine1.setAttributeNS(null, "stroke-width", 3);
                    svg.appendChild(newLine1);
                }

/*
                        <svg id={"svgLine" + this.props.documentid} width="4000" height="4000">
                            <line x1={this.state.xPos} y1={this.state.yPos - 300} x2={this.props.dotLocationTop.x} y2={this.props.dotLocationTop.y - 300} style={{ stroke: this.props.color, strokeWidth: "3" }} />
                        </svg>
*/

                return (
                    <div id={"Document" + this.props.documentid}>
                        <a href={"/" + this.props.storyid + "#" + this.props.documentid}>
                            <img id={this.props.imageName} src={this.props.image} style={{ marginRight: margin + 'px', borderColor: this.props.color }} alt="Picture of Document" height="200" width="150" ref={this.setImageRef} ></img>
                        </a>

                    </div >
                );

            } else if (this.props.referenceViewTop == 'Map' && this.props.referenceViewBottom == 'Timeline') {

                var svg = document.getElementById("svgTimeline2");
                if (svg.childNodes.length == 4)
                {
                    var lineBottom = document.getElementById("bottom" + this.props.documentid);

                    lineBottom.setAttributeNS(null, 'x1', this.state.xPos);
                    lineBottom.setAttributeNS(null, 'y1', this.state.yPos);
                    lineBottom.setAttributeNS(null, 'x2', this.props.dotLocationBottom.x);
                    lineBottom.setAttributeNS(null, 'y2', this.props.dotLocationBottom.y - 95);
                    lineBottom.setAttributeNS(null, 'stroke', this.props.color);

                } else
                {
                    var newLine2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    newLine2.setAttributeNS(null, 'id', "bottom" + this.props.documentid);
                    newLine2.setAttributeNS(null, 'x1', this.state.xPos);
                    newLine2.setAttributeNS(null, 'y1', this.state.yPos);
                    newLine2.setAttributeNS(null, 'x2', this.props.dotLocationBottom.x);
                    newLine2.setAttributeNS(null, 'y2', this.props.dotLocationBottom.y - 95);
                    newLine2.setAttributeNS(null, "stroke", this.props.color);
                    newLine2.setAttributeNS(null, "stroke-width", 3);
                    svg.appendChild(newLine2);
                }
/*
                        <svg id={"svgLineBottom" + this.props.documentid} width="4000" height="4000">
                            <line x1={this.state.xPos} y1={this.state.yPos + 100} x2={this.props.dotLocationBottom.x} y2={this.props.dotLocationBottom.y + 120} style={{ stroke: this.props.color, strokeWidth: "3" }} />
                        </svg>
*/

                return (
                    <div id={"Document" + this.props.documentid}>
                        <a href={"/" + this.props.storyid + "#" + this.props.documentid}>
                            <img id={this.props.imageName} src={this.props.image} style={{ marginRight: margin + 'px', borderColor: this.props.color }} alt="Picture of Document" height="200" width="150" ref={this.setImageRef} ></img>
                        </a>

                    </div >
                );

            } else { //no timeline on top nor bottom
                return (
                    <div id={"Document" + this.props.documentid}>
                        <a href={"/" + this.props.storyid + "#" + this.props.documentid}>
                            <img id={this.props.imageName} src={this.props.image} style={{ marginRight: margin + 'px', borderColor: this.props.color }} alt="Picture of Document" height="200" width="150" ref={this.setImageRef} ></img>
                        </a>
                    </div>
                );
            }
        }
    }
}

