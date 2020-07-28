import React from 'react';
import drawMap from './mapHelper.js';
import Documents from './documents.jsx';
import MapLegend from './mapLegend.jsx';
import '../static/css/style.css';

export default class Map extends React.Component {
    constructor(props) {
        super(props);
        this.map = null;
        this.state = { 
            colorBy: 'Document ID',
        };

        this.changeColorBy = this.changeColorBy.bind(this);
        console.log("printing out props in map");
        console.log(this.props);
    }

    componentDidMount() {
        drawMap(this.props);
        //TODO: above, have to go into this draw map function to make sure its returning what i need to then change each time cluster coloring changes
    }

    changeColorBy (event) {
        this.setState({
            colorBy: event.target.value
        });
    }

    render() {

        if (this.props.isUpper == true)
        {   
            if (this.props.referenceViewOrder[1] == "Timeline")
            {
                //<div id="map1" style={{ width: '55%' }} />    NOTE: had this style included before 7.25.20
                return (
                    <div id="mapButtonAndLegend">
                        <div id="map1" />
                            <div id="buttonAndLegend">
                                Color by:
                                <select id="colorByList" name="colorByList" onChange={this.changeColorBy} value={this.state.colorBy} >
                                    {this.props.clusterByOptions.map((clusterByOption, index) =>
                                        <option value={clusterByOption}>
                                            {clusterByOption}
                                        </option>
                                    )}
                                </select>
                                <MapLegend colorByOption={this.state.colorBy} answersPerCluster={this.props.answersPerCluster} imageOrder={this.props.imageOrder} clusterNumbers={this.props.clusterNumbers}  colors={this.props.colors} />
                            </div>
                    </div>
                )
            } else {
                return (
                    <div id="mapButtonAndLegend">
                        <div id="map1" />
                            <div id="buttonAndLegend">
                                Color by:
                                <select id="colorByList" name="colorByList" onChange={this.changeColorBy} value={this.state.colorBy} >
                                    {this.props.clusterByOptions.map((clusterByOption, index) =>
                                        <option value={clusterByOption}>
                                            {clusterByOption}
                                        </option>
                                    )}
                                </select>
                                <MapLegend colorByOption={this.state.colorBy} answersPerCluster={this.props.answersPerCluster} imageOrder={this.props.imageOrder} clusterNumbers={this.props.clusterNumbers} colors={this.props.colors} />
                            </div>
                    </div>
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
                            <Documents data={this.props.data} docImages={this.props.docImages} imageOrder={this.props.imageOrder} clusterByOptions={this.props.clusterByOptions} documents={this.props.documents} colors={this.props.colors} storyid={this.props.storyid} timelinePresent={false} referenceViewTop={this.props.referenceViewOrder[0]} referenceViewBottom={this.props.referenceViewOrder[1]} clusterBy={this.props.clusterBy} colorBy={this.props.colorBy} />
                        </div>
                        Map of: {this.props.question}
                        <div id="mapButtonAndLegend">
                            <div id="map2" />
                            <div id="buttonAndLegend">
                                Color by:
                                <select id="colorByList" name="colorByList" onChange={this.changeColorBy} value={this.state.colorBy} >
                                    {this.props.clusterByOptions.map((clusterByOption, index) =>
                                        <option value={clusterByOption}>
                                            {clusterByOption}
                                        </option>
                                    )}
                                </select>
                                <MapLegend colorByOption={this.state.colorBy} answersPerCluster={this.props.answersPerCluster} imageOrder={this.props.imageOrder} clusterNumbers={this.props.clusterNumbers} colors={this.props.colors} />
                            </div>
                        </div>
                    </div>
                )
            } else
            {
                return (
                    <div id="mapButtonAndLegend">
                        <div id="map2" />
                            <div id="buttonAndLegend">

                                Color by:
                                <select id="colorByList" name="colorByList" onChange={this.changeColorBy} value={this.state.colorBy} >
                                    {this.props.clusterByOptions.map((clusterByOption, index) =>
                                        <option value={clusterByOption}>
                                            {clusterByOption}
                                        </option>
                                    )}
                                </select>

                                <MapLegend colorByOption={this.state.colorBy} answersPerCluster={this.props.answersPerCluster} imageOrder={this.props.imageOrder} clusterNumbers={this.props.clusterNumbers} colors={this.props.colors} />
                            </div>
                    </div>
                )
            }
        }
    }
}
