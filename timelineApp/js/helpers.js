import * as d3 from 'd3';
import fetch from 'isomorphic-fetch';
import Timeline from './timelinePlugin.js';

var colors = ["1E90FF", "DAA520", "DC143C", "006400", "FF1493", "2F4F4F", "0000FF", "00BFFF"];

const drawTimeline = (props) => {
	//props are:
	//viewName={this.props.viewName} clusterBy={this.props.clusterBy} dataUrl={this.props.dataUrl} data={this.props.data} documents={this.props.documents} question={this.props.question} isUpper={this.props.isUpper}
//console.log("inside draw function that actually creates timeline w mock data");

//var viewName = props.viewName;

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
  margin: {"bottom": 60, "right": 200},
  labelBgColor: function(d, i){
    return colors[i];
  },
  dotColor: function(d, i){
    return colors[i];
  },
  linkColor: function(d, i){
    return colors[i];
  },
  textFn: function(d, i){
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
  margin: {"top": 60, "right": 200},
  labelBgColor: function(d, i){
    return colors[i];
  },
  dotColor: function(d, i){
    return colors[i];
  },
  linkColor: function(d, i){
    return colors[i];
  },
  textFn: function(d, i){
    return d.name;
  },
  textStyle: {
    'font-size': "smaller"
  }
});

}

//make interactive labels:
chart.on('labelClick', function(d,i){
  // do whatever you wish
  // d is the data associated with the clicked label, i is index
  window.location.href = "http://localhost:8000/3/#" + (i + 1)
  //console.log(d);
});

/*
chart.on('labelMouseenter', function(d,i){
  //display popup next to label with more info on that doc
  var labelElement = document.getElementById("label-g" + (i+1) + (props.isUpper == true ? "upper" : "lower"));
  var labelLocation = labelElement.getBoundingClientRect();
  //console.log(labelLocation);


});

chart.on('labelMouseleave', function(d,i){
  //delete popup pertaining to that label

});
*/

chart.data(myData).visualize().resizeToFit();

chart.dotInfo["colors"] = colors;
return chart.dotInfo;
}

export default drawTimeline;