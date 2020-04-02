import * as d3 from 'd3';
import timelineHelper from './timelinePlugin.js';


const drawTimeline = (props) => {
	//props are:
	//viewName={this.props.viewName} clusterBy={this.props.clusterBy} dataUrl={this.props.dataUrl} data={this.props.data} documents={this.props.documents} question={this.props.question} isUpper={this.props.isUpper}

	var testData = [
  {label: props.question, times: [
    {"starting_time": 1355752800000, "ending_time": 1355759900000},
    {"starting_time": 1355767900000, "ending_time": 1355774400000}]},
  {label: "person b", times: [
    {"starting_time": 1355759910000, "ending_time": 1355761900000}]},
  {label: "person c", times: [
    {"starting_time": 1355761910000, "ending_time": 1355763910000}]}
  ];

  var rectAndCircleTestData = [
		{times: [{"starting_time": 1355752800000, "display": "circle"},
						 {"starting_time": 1355767900000, "ending_time": 1355774400000}]},
		{times: [{"starting_time": 1355759910000, "display":"circle"}, ]},
		{times: [{"starting_time": 1355761910000, "ending_time": 1355763910000}]}
	];

    var chart = timelineHelper();
    if (props.isUpper)
    {
    	var svg = d3.select("#timeline1").append("svg").attr("width", 500)
  .datum(testData).call(chart);
    } else 
    {
    	var svg = d3.select("#timeline1").append("svg").attr("width", 500)
  .datum(rectAndCircleTestData).call(chart);
    }

}

export default drawTimeline;