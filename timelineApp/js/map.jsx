import React from 'react';
import drawMap from './mapHelper.js';
import drawTimeline from './helpers.js'
import Documents from './documents.jsx';
import '../static/css/style.css';

export default class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dotLocations: [],
            dotColors: [],
        };
    }

    componentDidMount() {
        drawMap(this.props);
        var dotInfo = drawTimeline(this.props);
        this.setState(
            {
                dotLocations: dotInfo["locations"],
                dotColors: dotInfo["colors"]
            }
        );
        document.getElementById("timeline2").style.display = "";
    }

    render() {
        
        return (
            <div id="timelines">

                <div id = "map"/>

                <div id="timeline2" />
                

                <div id="documentsDiv">
                    <Documents data={this.props.data} docImages={this.props.docImages} clusterBy={this.props.clusterBy} documents={this.props.documents} dotLocations={this.state.dotLocations} dotColors={this.state.dotColors} />
                </div>

                

            </div>

            // <div id="mapPortion">
            //     <div id="map" />

            //     <div id="documentsDiv">
            //         <Documents data={this.props.data} docImages={this.props.docImages} clusterBy={this.props.clusterBy} documents={this.props.documents} dotLocations={this.state.dotLocations} dotColors={this.state.dotColors} />
            //     </div>
            // </div>
        )
    }
}
