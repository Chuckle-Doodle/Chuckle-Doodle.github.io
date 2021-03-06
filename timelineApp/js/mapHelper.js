class DocumentData {
    constructor() {
        this.docID;
        this.location = "someLocation";
        this.coordinates = []; // [longitude, latitude]
        this.color = "someColor";
        this.imgSrc = "";
        this.docStyle;
    }
}

function preprocessData(props, docData, colors) {
    props.documents.forEach(doc => docData.push(new DocumentData()));

    // gets the index of the question that has the word "where" in it (assuming that we want to use this question for location purposes)
    var locationIdx = props.documents[0].Questions.findIndex(function (question) {
        return question.toLowerCase().includes("where");
    });
    
    // gets all the locations
    props.documents.forEach(function (doc, idx) {

        docData[idx].docID = idx + 1;

        docData[idx].location = doc.Answers[locationIdx];
        docData[idx].imgSrc = doc["Frontcover"];
        //decide which color to give this document based on props:
        if (props.colorBy == "Document ID") {  //i think props will always equal this! ...
            docData[idx].color = colors[idx];
        } else {
            //determine which cluster number this doc is in to determine color!
        }
        //docData[idx].color = colors[idx];
    });
    docData.forEach(doc =>
        // geocoder feature
        $.getJSON('https://nominatim.openstreetmap.org/search?format=json&q=' + doc.location, function (data) {
            // var FoundExtent = data[0].boundingbox;
            doc.coordinates = [parseFloat(data[0].lon), parseFloat(data[0].lat)];
        }));
}

function removeDuplicatedCoordinates(docData, duplicateCoordinateOffset) {
    var coordinates = [];
    docData.forEach(function (doc, idx) {
        coordinates.push([doc.coordinates, idx]);
    });
    coordinates.sort(); // sort coordinates then see if there are duplicate coordinates
    for (let i = 1; i < coordinates.length; i++) {
        var prevCoordinate = coordinates[i - 1][0];
        while (i < coordinates.length && coordinates[i][0].toString() == prevCoordinate.toString()) {
            prevCoordinate = coordinates[i][0].slice();
            coordinates[i][0][0] = coordinates[i - 1][0][0] + duplicateCoordinateOffset;
            docData[coordinates[i][1]].coordinates = coordinates[i][0];
            ++i;
        }
    }
}

function getCenterCoordinates(docData) {
    var minX = 200, maxX = -200, minY = 200, maxY = -200;
    docData.forEach(function (doc) {
        minX = Math.min(minX, doc.coordinates[0]);
        maxX = Math.max(maxX, doc.coordinates[0]);
        minY = Math.min(minY, doc.coordinates[1]);
        maxY = Math.max(maxY, doc.coordinates[1]);
    });

    var center = [(minX + maxX) / 2, (minY + maxY) / 2];
    return center;
}

function displayMap(props, docData) {
    var duplicateCoordinateOffset = .5; // in terms of longitude
    removeDuplicatedCoordinates(docData, duplicateCoordinateOffset);

    var center = getCenterCoordinates(docData);
    var vectorSource = new ol.source.Vector({});

    docData.forEach(function (doc, index) {
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

    // setInterval(function () {
    //     vectorSource.getFeatures().forEach(feature => feature.changed());
    // }, 2000);

    var activeColor;
    var currRes = -1;
    var docIdx = 0;
    var map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM({
                    key: 'myKey',
                    crossOrigin: ''
                })
            }),
            new ol.layer.Vector({
                source: vectorSource,
                style: function (feature, resolution) { 
                    if (feature.get("initStyle") == undefined && feature.get("style").getImage().getImage().width != 0) {
                        currRes = resolution;
                        activeColor = docData[docIdx].color;

                        var initStyle = feature.get("initStyle");
                        if (!initStyle) {
                            initStyle = feature.get("style");
                            feature.set("initStyle", initStyle);
                        }
                        var image = initStyle.getImage().getImage();
                        //image.setAttribute("id", "mapDocImage" + docIdx);
                        console.log("old img file is", image, initStyle);
                        var canvas = document.createElement("canvas");
                        //canvas.setAttribute("id", "documentImage" + docIdx);
                        //console.log("current canvas is!", canvas);
                        var ctx = canvas.getContext("2d");
                        var dArr = [-1, -1, 0, -1, 1, -1, -1, 0, 1, 0, -1, 1, 0, 1, 1, 1], // offset array
                            s = 8, // thickness scale
                            i = 0, // iterator
                            x = s, // final x position
                            y = s; // final y position

                        //set new canvas dimentions adjusted for border
                        canvas.width = image.width * 0.1 + s + s;
                        canvas.height = image.height * 0.1 + s + s;

                        // draw images at offsets from the array scaled by s
                        for (; i < dArr.length; i += 2)
                            ctx.drawImage(image, x + dArr[i] * s, y + dArr[i + 1] * s);

                        // fill with color
                        ctx.globalCompositeOperation = "source-in";
                        ctx.fillStyle = activeColor;
                        ctx.fillRect(0, 0, canvas.width, canvas.height);

                        // draw original image in normal mode
                        ctx.globalCompositeOperation = "source-over";
                        ctx.drawImage(image, 0, 0, image.width, image.height, x, y, canvas.width - 2 * x, canvas.height - 2 * y);

                        //create new openlayers icon style from canvas
                        var newStyle = new ol.style.Style({
                            image: new ol.style.Icon(
                            /** @type {olx.style.IconOptions} */({
                                    crossOrigin: "anonymous",
                                    src: undefined,
                                    img: canvas,
                                    imgSize: canvas ? [canvas.width, canvas.height] : undefined,
                                    scale: 2500 / resolution
                                }))
                        });

                        feature.set("style", newStyle);
                        docData[docIdx].docStyle = newStyle;
                        ++docIdx;
                    }
                    else if (currRes != -1 && currRes != resolution) {
                        currRes = resolution;

                        var scaleFactor = 2500 / resolution;
                        if (scaleFactor < 0.27) scaleFactor = 0;
                        docData.forEach(function (doc) {
                            doc.docStyle.getImage().setScale(scaleFactor);
                        })
                    }
                    return feature.get("style");
                }
            })
        ],
        target: props.isUpper == true ? document.getElementById("map1") : document.getElementById("map2"),
        view: new ol.View({
            center: ol.proj.fromLonLat(center),
            maxZoom: 6.75
        }),
    });

    // makes sure all docs are fit on the screen
    map.getView().fit(vectorSource.getExtent());

    docData.forEach(function (doc, index) {
        var offset = -2; // lowers the marker to make room for the doc
        var colorSrc = "/static/var/markers/" + doc.color + ".png";

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

        var marker = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([doc.coordinates[0], doc.coordinates[1] + offset])));
        marker.setStyle(iconStyle);
        marker.setId(index + 5);  //the markers will have id's 5-8 if there are 4 documents on the map
        vectorSource.addFeature(marker);
    });
    //console.log("map object at end of displayMap function");
    //console.log(map);
    //console.log(map.getLayers());
    //console.log(map.getLayers().array_);

    //return map and data we may need later!;
    return [map, docData];

    //TODO: return map and/or markers to the drawMap function!!

    //idea: separate out markers from actual map, so each time color clustering changes, only change markers, not entire map!
}

// the main function that brings it all together
const drawMap = (props) => {

    // The main source of data
    //console.log("printing props!");
    //console.log(props);
    var docData = [];
    preprocessData(props, docData, props.colors);

    //above function, preprocessData is suitable for initializing colors based on doc id
    //we need another function that EDITS only the color!!!
    //once we have updated the colors, use OL methods for accessing each feature in vector layer and updating color with updated value!

    // needs timeout to retrieve the locations for geocoding
    //setTimeout(function() { 
        //displayMap(map, props, docData, props.colors);
    //}, 2000);

    //using promises:
    var promise = new Promise( function(resolve, reject) {
        setTimeout(function() { 
            resolve(displayMap(props, docData, props.colors));
        }, 2000);
    });
    return promise;

}


export default drawMap;

