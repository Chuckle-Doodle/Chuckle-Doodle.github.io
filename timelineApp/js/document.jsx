import React from 'react';

export default class Document extends React.Component {
    constructor(props) {
        super(props);
        this.imageElement = null;

        this.mapThenTimelineCase = false;
        if (this.props.referenceViewTop == "Map" && this.props.referenceViewBottom == "Timeline")
        {
            this.mapThenTimelineCase = true;
        }

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
        if (prevProps == this.props)
        {
            return;
        }
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
                    yPos: this.mapThenTimelineCase ? this.imageElement.getBoundingClientRect().y : this.imageElement.getBoundingClientRect().y + 310,
                }
            );
        }
    }


    render() {
        //console.log("about to render doc");
        //console.log(this.state);

        var margin = 0;
        if (this.props.endOfCluster == true) {
            margin = 150;
        }

        if (this.state.xPos == null) {
            //console.log("rendering image");

            return (
                <img src={this.props.image} id={this.props.imageName} style={{ marginRight: margin + 'px', borderColor: this.props.lineColor }} alt="Picture of Document" height="200" width="150" ref={this.setImageRef} ></img>

            );

        } else {
            //console.log("image already rendered!");

            //4 different cases to return: timeline on top, timeline on bottom, timeline on top and bottom, no timeline
            //TODO: MAKE THIS STEP MORE EFFICIENT AND SCALABLE IN FUTURE
            if (this.props.referenceViewTop == 'Timeline' && this.props.referenceViewBottom == 'Timeline') {

                return (
                    <div id={"Document" + this.props.documentid}>
                        <a href={"/" + this.props.storyid + "#" + this.props.documentid}>
                            <img id={this.props.imageName} src={this.props.image} style={{ marginRight: margin + 'px', borderColor: this.props.lineColor }} alt="Picture of Document" height="200" width="150" ref={this.setImageRef} ></img>
                        </a>

                        <svg id={"svgLine" + this.props.documentid} width="4000" height="4000">
                            <line x1={this.state.xPos} y1={this.state.yPos - 300} x2={this.props.dotLocationTop.x} y2={this.props.dotLocationTop.y - 300} style={{ stroke: this.props.lineColor, strokeWidth: "3" }} />
                        </svg>
                    
                        <svg id={"svgLineBottom" + this.props.documentid} width="4000" height="4000">
                            <line x1={this.state.xPos} y1={this.state.yPos - 100} x2={this.props.dotLocationBottom.x} y2={this.props.dotLocationBottom.y - 30} style={{ stroke: this.props.lineColor, strokeWidth: "3" }} />
                        </svg>

                    </div >

                );

            } else if (this.props.referenceViewTop == 'Timeline' && this.props.referenceViewBottom == 'Map') {
                return (
                    <div id={"Document" + this.props.documentid}>
                        <a href={"/" + this.props.storyid + "#" + this.props.documentid}>
                            <img id={this.props.imageName} src={this.props.image} style={{ marginRight: margin + 'px', borderColor: this.props.lineColor }} alt="Picture of Document" height="200" width="150" ref={this.setImageRef} ></img>
                        </a>

                        <svg id={"svgLine" + this.props.documentid} width="4000" height="4000">
                            <line x1={this.state.xPos} y1={this.state.yPos - 300} x2={this.props.dotLocationTop.x} y2={this.props.dotLocationTop.y - 300} style={{ stroke: this.props.lineColor, strokeWidth: "3" }} />
                        </svg>

                    </div >
                );

            } else if (this.props.referenceViewTop == 'Map' && this.props.referenceViewBottom == 'Timeline') {
                return (
                    <div id={"Document" + this.props.documentid}>
                        <a href={"/" + this.props.storyid + "#" + this.props.documentid}>
                            <img id={this.props.imageName} src={this.props.image} style={{ marginRight: margin + 'px', borderColor: this.props.lineColor }} alt="Picture of Document" height="200" width="150" ref={this.setImageRef} ></img>
                        </a>
                    
                        <svg id={"svgLineBottom" + this.props.documentid} width="4000" height="4000">
                            <line x1={this.state.xPos} y1={this.state.yPos} x2={this.props.dotLocationBottom.x} y2={this.props.dotLocationBottom.y + 765} style={{ stroke: this.props.lineColor, strokeWidth: "3" }} />
                        </svg>

                    </div >
                );

            } else { //no timeline on top nor bottom
                return (
                    <div id={"Document" + this.props.documentid}>
                        <a href={"/" + this.props.storyid + "#" + this.props.documentid}>
                            <img id={this.props.imageName} src={this.props.image} style={{ marginRight: margin + 'px', borderColor: this.props.lineColor }} alt="Picture of Document" height="200" width="150" ref={this.setImageRef} ></img>
                        </a>
                    </div>
                );
            }

        }
    }
}