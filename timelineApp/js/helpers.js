import * as d3 from 'd3';
import fetch from 'isomorphic-fetch';
import Timeline from './timelinePlugin.js';

const drawTimeline = (props) => {

    var myData = [];  //take props.data and edit it to look like above data, place in this variable

    for (var i = 0; i < props.data.length; i++) {
        let dataPoint = {};
        dataPoint["name"] = props.data[i]["FormDataAnswers"][props.data[i]["FormDataQuestions"].indexOf('Title')];
        dataPoint["time"] = props.data[i]["FormDataAnswers"][props.data[i]["FormDataQuestions"].indexOf(props.question)];
        myData.push(dataPoint);
    }

    //turn times into javascript Date objects
    for (var j = 0; j < myData.length; j++) {
        myData[j].time = new Date(parseInt(myData[j].time), 0, 1); //make all dates jan 1
    }

    if (props.isUpper == true) {

        var chart = new Timeline('#timeline1', {
            direction: 'up',
            initialWidth: 1100,
            initialHeight: 500,
            layerGap: 90,
            dotRadius: 7,
            margin: { "bottom": 60, "right": 200 },
            labelBgColor: function (d, i) {
                return (props.colorBy == "Document ID" || props.clusterBy == "Document ID" ? props.colors[i] : props.colors[props.colors.length - 1 - props.imageOrder.clusterOrder[i]]);
            },
            dotColor: function (d, i) {
                return (props.colorBy == "Document ID" || props.clusterBy == "Document ID" ? props.colors[i] : props.colors[props.colors.length - 1 - props.imageOrder.clusterOrder[i]]);
            },
            linkColor: function (d, i) {
                return (props.colorBy == "Document ID" || props.clusterBy == "Document ID" ? props.colors[i] : props.colors[props.colors.length - 1 - props.imageOrder.clusterOrder[i]]);
            },
            textFn: function (d, i) {
                return d.name;
            },
            textStyle: {
                'font-size': "smaller"
            }
        });
    } else {  //isUpper == false
        var chart = new Timeline('#timeline2', {
            direction: 'down',
            initialWidth: 1100,
            initialHeight: 500,
            layerGap: 90,
            dotRadius: 7,
            margin: { "top": 60, "right": 200 },
            labelBgColor: function (d, i) {
                return (props.colorBy == "Document ID" || props.clusterBy == "Document ID" ? props.colors[i] : props.colors[props.colors.length - 1 - props.imageOrder.clusterOrder[i]]);
            },
            dotColor: function (d, i) {
                return (props.colorBy == "Document ID" || props.clusterBy == "Document ID" ? props.colors[i] : props.colors[props.colors.length - 1 - props.imageOrder.clusterOrder[i]]);
            },
            linkColor: function (d, i) {
                return (props.colorBy == "Document ID" || props.clusterBy == "Document ID" ? props.colors[i] : props.colors[props.colors.length - 1 - props.imageOrder.clusterOrder[i]]);
            },
            textFn: function (d, i) {
                return d.name;
            },
            textStyle: {
                'font-size': "smaller"
            }
        });
    }

    //make interactive labels:
    chart.on('labelClick', function (d, i) {
        // do whatever you wish
        // d is the data associated with the clicked label, i is index
        window.location.href = window.location.origin + "/" + props.storyid + "/#" + (i + 1);
    });

    chart.data(myData).visualize().resizeToFit();

    //chart.dotInfo["colors"] = colors;
    //return chart.dotInfo;
    return chart;
}

export default drawTimeline;