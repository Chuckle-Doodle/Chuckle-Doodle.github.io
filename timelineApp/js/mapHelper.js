class DocumentData {
    constructor() {
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
        docData[idx].location = doc.Answers[locationIdx];
        docData[idx].imgSrc = doc["Frontcover"];
        docData[idx].color = colors[idx];
    });
    docData.forEach(doc =>
        // geocoder feature
        $.getJSON('https://nominatim.openstreetmap.org/search?format=json&q=' + doc.location, function (data) {
            // console.log(data);
            // var FoundExtent = data[0].boundingbox;
            // var placemark_lon = data[0].lon;
            // var placemark_lat = data[0].lat;
            doc.coordinates = [parseFloat(data[0].lon), parseFloat(data[0].lat)];
        }));
}

function displayMap(props, docData, colors) {
    var coordinate = [-101.1017, 40.7438];
    var vectorSource = new ol.source.Vector({});

    docData.forEach(function (doc) {
        var offset = 2.6; // this is to elevate the document to make space for the markers

        // display image
        var img = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [12, 37],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                opacity: 1,
                src: doc.imgSrc,
                img: undefined,
                imgSize: undefined,
                scale: 0.1
            })
        });

        var tempFeature = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([doc.coordinates[0], doc.coordinates[1] + offset])));
        tempFeature.set("style", img);
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
                        var canvas = document.createElement("canvas");
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
                        // console.log(ol.proj.toLonLat( map.getView().getCenter() ));
                    }
                    return feature.get("style");
                }
            })
        ],
        target: document.getElementById("map"),
        view: new ol.View({
            center: ol.proj.fromLonLat(coordinate),
            zoom: 5,
            maxZoom: 6.75
        })
    });

    docData.forEach(function (doc) {
        var colorSrc = "/static/var/markers/" + doc.color + ".png";

        var iconStyle = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [12, 37],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                opacity: 0.8,
                src: colorSrc
            })
        });

        var marker = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([doc.coordinates[0], doc.coordinates[1]])));
        marker.setStyle(iconStyle);
        vectorSource.addFeature(marker);
    });
}

const drawMap = (props) => {
    //props are:
    //viewName={props.viewName} clusterBy={props.clusterBy} dataUrl={props.dataUrl} data={props.data} documents={props.documents} question={props.question} isUpper={props.isUpper}
    //console.log("inside draw function that actually creates timeline w mock data");

    //var viewName = props.viewName;

    // var myData = [];  //take props.data and edit it to look like above data, place in this variable

    // console.log(props.viewName); // Author View
    // console.log(props.clusterBy); // Author
    // console.log(props.dataUrl); // /api/stories/1/test
    // console.log(props.data); // {filename: asdf.pdf, FormDataAnsers: {array}, FormDataQuestions: {array}, Frontcover: /path/asdf.jpg, docId: asdf}
    // console.log(props.documents); // {Frontcover: /path/asdf.jpg, Questions: {array}, Answers: {array}, Filename: asdf.pdf, docId: asdf}
    // console.log(props.question); // When was this written
    // console.log(props.isUpper); // false

    var colors = ["lightskyblue", "yellow", "red", "green"];

    // The main source of data
    var docData = [];
    preprocessData(props, docData, colors);

    setTimeout(function() { displayMap(props, docData, colors); }, 2000);
}

export default drawMap;


