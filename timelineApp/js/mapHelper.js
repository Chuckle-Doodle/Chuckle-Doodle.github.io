// import * as ol from 'ol';

const drawMap = (props) => {
    //props are:
    //viewName={props.viewName} clusterBy={props.clusterBy} dataUrl={props.dataUrl} data={props.data} documents={props.documents} question={props.question} isUpper={props.isUpper}
    //console.log("inside draw function that actually creates timeline w mock data");

    //var viewName = props.viewName;

    // var myData = [];  //take props.data and edit it to look like above data, place in this variable

    console.log(props.viewName); // Author View
    console.log(props.clusterBy); // Author
    console.log(props.dataUrl); // /api/stories/1/test
    console.log(props.data); // {filename: asdf.pdf, FormDataAnsers: {array}, FormDataQuestions: {array}, Frontcover: /path/asdf.jpg, docId: asdf}
    console.log(props.documents); // {Frontcover: /path/asdf.jpg, Questions: {array}, Answers: {array}, Filename: asdf.pdf, docId: asdf}
    console.log(props.question); // When was this written
    console.log(props.isUpper); // false

    console.log(props.documents[0]["Frontcover"])

    var mapId = 'map';

    function createMap() {
        var coordinate = [-117.1610838, 32.715738];
        var vectorSource = new ol.source.Vector({});
        var vectorLayer = new ol.layer.Vector({
            source: vectorSource
        });
        var view = new ol.View({
            center: ol.proj.fromLonLat(coordinate),
            zoom: 12,
            maxZoom: 19,
            minZoom: 5
        });
        var map = new ol.Map({
            layers: [new ol.layer.Tile({
                source: new ol.source.OSM({
                    key: 'myKey',
                    crossOrigin: ''
                })
            }), vectorLayer,],
            target: document.getElementById(mapId),
            controls: ol.control.defaults(),
            view: view
        });


        // adds line

        var points = [[-117.1610838, 32.715738], [-95.04286, 46.9235]];

        for (var i = 0; i < points.length; i++) {
            points[i] = ol.proj.transform(points[i], 'EPSG:4326', 'EPSG:3857');
        }

        var featureLine = new ol.Feature({
            geometry: new ol.geom.LineString(points)
        });

        var vectorLine = new ol.source.Vector({});
        vectorLine.addFeature(featureLine);

        var vectorLineLayer = new ol.layer.Vector({
            source: vectorLine,
            style: new ol.style.Style({
                fill: new ol.style.Fill({ color: 'red', weight: 4 }),
                stroke: new ol.style.Stroke({ color: 'red', width: 2 })
            })
        });

        map.addLayer(vectorLineLayer);

        // create custom marker image with custom text in bottom
        var iconStyle = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [12, 37],
                anchorXUnits: 'pixels', //'fraction'
                anchorYUnits: 'pixels',
                opacity: 0.8,
                src: '/static/var/markers/blue.png'
            })
        });

        var coordinate = [-117.1610838, 32.715738];
        var marker = new ol.Feature(
            new ol.geom.Point(ol.proj.fromLonLat(coordinate))
        );
        marker.setStyle(iconStyle);
        vectorSource.addFeature(marker);

        // display image
        var img = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [12, 37],
                anchorXUnits: 'pixels', //'fraction'
                anchorYUnits: 'pixels',
                opacity: 1,
                src: props.documents[0]["Frontcover"],
                scale: 0.1
            })
        });
        marker = new ol.Feature(
            new ol.geom.Point(ol.proj.fromLonLat([coordinate[0] - 0.02, coordinate[1] + 0.065]))
        );
        marker.setStyle(img);
        vectorSource.addFeature(marker);


        return this;
    }

    var map = createMap();
    // map.setMarker([-117.1610838, 32.715738])
    // map.setImg([-117.1610838, 32.715738])
}

export default drawMap;