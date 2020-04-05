import * as d3 from 'd3';
import Timeline from './timelinePlugin2.js';

var colors = ["0000FF", "A52A2A", "DC143C", "006400", "FF8C00", "2F4F4F", "FF1493", "00BFFF"];

const drawTimeline2 = (props) => {
	//props are:
	//viewName={this.props.viewName} clusterBy={this.props.clusterBy} dataUrl={this.props.dataUrl} data={this.props.data} documents={this.props.documents} question={this.props.question} isUpper={this.props.isUpper}
//console.log("inside draw function that actually creates timeline w mock data");

var data = [
  {time: new Date(1977, 4,25), episode: 4, name: 'A New Hope'},
  {time: new Date(1980, 4,17), episode: 5, name: 'The Empire Strikes Back'},
  {time: new Date(1984, 4,25), episode: 6, name: 'Return of the Jedi'},
  {time: new Date(1999, 4,19), episode: 1, name: 'The Phantom Menace'},
  {time: new Date(2002, 4,16), episode: 2, name: 'Attack of the Clones'},
  {time: new Date(2005, 4,19), episode: 3, name: 'Revenge of the Sith'},
  {time: new Date(2015,11,18), episode: 7, name: 'The Force Awakens'},
];

var viewName = props.viewName;

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
  initialWidth: 1400,
  initialHeight: 500,
  layerGap: 90,
  dotRadius: 5,
  labelBgColor: function(d, i){
    return "#222";
  },
  dotColor: function(d, i){
    return colors[i];
  },
  linkColor: function(d, i){
    return "222";
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
  direction: 'up',
  initialWidth: 1400,
  initialHeight: 500,
  layerGap: 90,
  dotRadius: 5,
  labelBgColor: function(d, i){
    return "#222";
  },
  dotColor: function(d, i){
    return colors[i];
  },
  linkColor: function(d, i){
    return "222";
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
  console.log("just clicked on label: " + i);
});

chart.data(myData).visualize().resizeToFit();

//console.log("end of fn");

}

export default drawTimeline2;