import React from 'react';
import drawMap from './mapHelper.js';
import drawTimeline from './helpers.js'
import Documents from './documents.jsx';
import '../static/css/style.css';

export default class Map extends React.Component {
    constructor(props) {
        super(props);
        //this.state = {
            //hasBeenRendered: false,
        //};
    }

    componentDidMount() {
        drawMap(this.props);
        //var dotInfo = drawTimeline(this.props);
        //this.setState(
            //{
                //hasBeenRendered: true
            //}
        //);
        //document.getElementById("timeline2").style.display = "";
    }

    render() {
        //console.log("this.state.hasBeenRendered", this.state.hasBeenRendered);
        
        //return (
            //<div id="timelines">

                //<div id = "map"/>
                

                //<div id="documentsDiv">
                    //<Documents data={this.props.data} docImages={this.props.docImages} clusterBy={this.props.clusterBy} documents={this.props.documents} dotLocations={this.state.dotLocations} dotColors={this.state.dotColors} />
                //</div>

                

            //</div>
        //}

            //BELOW THIS WAS OLD STUFF. ABOVE IS WHAT ALEX HAD GOING ^^^^^^^^^^^^^^^^^^^^^^^^

            //                <div id="timeline2" />

            // <div id="mapPortion">
            //     <div id="map" />

            //     <div id="documentsDiv">
            //         <Documents data={this.props.data} docImages={this.props.docImages} clusterBy={this.props.clusterBy} documents={this.props.documents} dotLocations={this.state.dotLocations} dotColors={this.state.dotColors} />
            //     </div>
            // </div>


        if (this.props.isUpper == true)
        {   
            if (this.props.referenceViewOrder[1] == "Timeline")
            {
                return (
                    <div id="map1" style={{ width: '55%' }} />
                )
            } else {
                return (
                    <div id="map1" />
                )
            }
        } else //this.props.isUpper == false
        {

            //check if both reference views are maps, in which case render docs
            if (this.props.referenceViewOrder[0] == "Map")
            {
                return (
                    <div id="maps">

                        <div id="documentsDiv">
                            <Documents data={this.props.data} docImages={this.props.docImages} clusterBy={this.props.clusterBy} documents={this.props.documents} dotColors={this.props.colors} storyid={this.props.storyid} timelinePresent={false} referenceViewTop={this.props.referenceViewOrder[0]} referenceViewBottom={this.props.referenceViewOrder[1]} />
                        </div>

                        <div id="map2" />

                    </div>
                )
            } else
            {
                return (
                    <div id="map2" />
                )
            }
        }
    }
}
