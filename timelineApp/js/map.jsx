import React from 'react';
import drawMap from './mapHelper.js';

import Documents from './documents.jsx';
import MapLegend from './mapLegend.jsx';
import '../static/css/style.css';

export default class Map extends React.Component {
    constructor(props) {
        super(props);
        this.map = null;
        this.mapDocData = null;
        this.state = { 
            colorBy: 'Document ID',
            //map: null,
        };

        this.changeColorBy = this.changeColorBy.bind(this);
        this.updateMapColors = this.updateMapColors.bind(this);

    }

    componentDidMount() {
        console.log("running drawMap in compDidMount of map.jsx");
        drawMap(this.props).then(response => {
            console.log("printing after promise", response);  //can set state here if map is state!
            //this.setState({
                //map: response
            //});
            this.map = response[0];
            this.mapDocData = response[1];
            console.log(this.map, this.mapDocData);
        });
        console.log("end of compDidMount in map.jsx");
        //console.log(this.map, "map is after drawMap");
        //this.setState({
            //map: drawMap(this.map, this.props, false)
        //});
        //console.log("map at end of compDidMount");
        //console.log(this.map);
        //TODO: above, have to go into this draw map function to make sure its returning what i need to then change each time cluster coloring changes
    }

    changeColorBy (event) {
        this.setState({
            colorBy: event.target.value
        });
    }

    updateMapColors() {
        if (this.state.colorBy == "Document ID") {
            for (let i = 0; i < this.mapDocData.length; i++) {
                this.mapDocData[i].color = this.props.colors[i];
            }
        } else {  //this.state.colorBy == something else
            console.log("answerspercluster", this.props.answersPerCluster[this.state.colorBy], this.props.clusterNumbers);

            var clusterColors = {};

            for (var key in this.props.answersPerCluster[this.state.colorBy]) {

                clusterColors[key] = null; //initialize
                if (this.props.answersPerCluster[this.state.colorBy].hasOwnProperty(key)) {

                    var clusterNumber = this.props.clusterNumbers[key];

                    clusterColors[key] = this.props.colors[this.props.colors.length - 1 - clusterNumber];
    
                    for (let j = 0; j < this.props.answersPerCluster[this.state.colorBy][key].length; j++) {
                        console.log("docDI is", this.props.answersPerCluster[this.state.colorBy][key][j]);
                        this.mapDocData[this.props.answersPerCluster[this.state.colorBy][key][j] - 1].color = clusterColors[key];
                    }

                }
            }

        }
        console.log("mapDocData is", this.mapDocData);

        //at this point mapDocData is updated, now actually change map colors with this new data
    var vectorSource = new ol.source.Vector({});
    this.mapDocData.forEach(function (doc, index) {
        var offset = 1.5; // this is to elevate the document to make space for the markers

        // display image
        var img = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [12, 37],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                opacity: 1,
                src: doc.imgSrc,

                id: doc.docID,

                img: undefined,
                imgSize: undefined,
                scale: 0.1
            })
        });

        var tempFeature = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([doc.coordinates[0], doc.coordinates[1] + offset])));
        tempFeature.set("style", img);
        tempFeature.setId(index + 1);
        vectorSource.addFeature(tempFeature);
    });
        //print out all map's features
        console.log(this.map.getLayers().array_[1].getSource().getFeatures());
        var tempFeatureList = [];

        //iterate through all markers in the map and change accordingly
        for (let f = 0; f < this.map.getLayers().array_[1].getSource().getFeatures().length; f++) {
            let feature = this.map.getLayers().array_[1].getSource().getFeatures()[f];
            console.log("At the top, feature id is", feature.getId());
            if (feature.getId() < 5) {
                tempFeatureList.push(feature);
                continue;
            }

            //check if selected feature is marker or document image
            //if (feature.getId() > 4) {
                //feature is a marker
                //var featureId = feature.getId() < 5 ? feature.getId() : feature.getId() - 4;
                var featureColor = this.mapDocData[feature.getId() - 5].color
                if (featureColor == "tan") {
                    featureColor = "brown"
                }
                if (featureColor == "mediumorchid") {
                    featureColor = "purple"
                }
                var colorSrc = "/static/var/markers/" + featureColor + ".png";

                //create new style object
                var iconStyle = new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [12, 37],
                        anchorXUnits: 'pixels',
                        anchorYUnits: 'pixels',
                        opacity: 0.8,
                        src: colorSrc,
                        scale: 1.5
                    })
                });

                //set style
                feature.setStyle(iconStyle);
            //} else
            //{
                //console.log("id of deleted feature is", feature.getId());
                //remove feature
                //this.map.getLayers().array_[1].getSource().removeFeature(feature);

                //TODO: NEED TO DISPLAY THE IMAGES FIRST BEFORE DOING THE CANVAS JAZZ. Like ALex
                //does in display map function. first create vector source and add features to it that are the doc images
                //current issue: the images havent been created yet, so i cant access them
            //}
        }

        //iterate through document images and delete them so we can recreate them with new border colors
        for (let f = 0; f < tempFeatureList.length; f++) {
            this.map.getLayers().array_[1].getSource().removeFeature(tempFeatureList[f]);
        }



        //iterate through all document images in the map and change their borders accordingly
        for (let j = 0; j < vectorSource.getFeatures().length; j++) {


//feature is a document image
                console.log("feature is a doc image");
                var newCanvas = document.createElement("canvas");

                var image = vectorSource.getFeatures()[j].get("style").getImage().getImage();
                console.log("image is new", image);

                var activeColor = this.mapDocData[j].color;

                        //var initStyle = feature.get("initStyle");
                        //if (!initStyle) {
                            //initStyle = feature.get("style");
                            //feature.set("initStyle", initStyle);
                        //}
                        //var image = initStyle.getImage().getImage();
                        //var canvas = document.createElement("canvas");
                        //canvas.setAttribute("id", "documentImage" + docIdx);
                        //console.log("current canvas is!", canvas);
                var ctx = newCanvas.getContext("2d");
                var dArr = [-1, -1, 0, -1, 1, -1, -1, 0, 1, 0, -1, 1, 0, 1, 1, 1], // offset array
                    s = 8, // thickness scale
                    i = 0, // iterator
                    x = s, // final x position
                    y = s; // final y position

                //set new canvas dimentions adjusted for border
                newCanvas.width = image.width * 0.1 + s + s;
                newCanvas.height = image.height * 0.1 + s + s;

                        // draw images at offsets from the array scaled by s
                        for (; i < dArr.length; i += 2)
                            ctx.drawImage(image, x + dArr[i] * s, y + dArr[i + 1] * s);

                        // fill with color
                        ctx.globalCompositeOperation = "source-in";
                        ctx.fillStyle = activeColor;
                        ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

                        // draw original image in normal mode
                        ctx.globalCompositeOperation = "source-over";
                        ctx.drawImage(image, 0, 0, image.width, image.height, x, y, newCanvas.width - 2 * x, newCanvas.height - 2 * y);


                        //feature.set("style", newStyle);






                var newStyle = new ol.style.Style({
                    image: new ol.style.Icon(
                        ({
                            crossOrigin: "anonymous",
                            src: undefined,
                            img: newCanvas,
                            imgSize: this.mapDocData[j].docStyle.image_.iconImage_.size_,
                            scale: this.mapDocData[j].docStyle.image_.scale_
                        }))
                });

                this.mapDocData[j].docStyle = newStyle;
                vectorSource.getFeatures()[j].setStyle(newStyle);
                //add this feature to the map
                this.map.getLayers().array_[1].getSource().addFeature(vectorSource.getFeatures()[j]);
        }

    }


    render() {
        console.log("beg of render in map.jsx");
        //ensure map markers have correct colors
        //only need to check if drawMap has already completed
        if (this.map != null) {
            console.log("updating map marker colors");
            //update doc colors based on color by option selected:
            this.updateMapColors();
            //updateMapColors();

            //console.log(this.map.getLayers().array_);
            //vector layer is second layer in the map from how we coded it!
            //console.log(this.map.getLayers().array_[1].getSource().getFeatures());
        }

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
