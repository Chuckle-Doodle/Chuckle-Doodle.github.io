import * as d3 from 'd3';
import timelineHelper from './timelinePlugin.js';


const drawTimeline = (props) => {
	//props are:
	//viewName={this.props.viewName} clusterBy={this.props.clusterBy} dataUrl={this.props.dataUrl} data={this.props.data} documents={this.props.documents} question={this.props.question} isUpper={this.props.isUpper}

	var testData = [
  {label: props.question, times: [
    {"starting_time": new Date("July 21, 1983 01:15:00").getTime(), "ending_time": new Date("July 21, 1990 01:15:00").getTime(), "id": "a1"},
    {"starting_time": new Date("July 21, 1999 01:15:00").getTime(), "ending_time": new Date("July 21, 2000 01:15:00").getTime(), "id": "a2"}
    ]}
  ];

  var rectAndCircleTestData = [
		{times: [{"starting_time": 345883500000, "ending_time": 345901500000},
		{"starting_time": 503649900000, "ending_time": 503667900000}]}
	];

    var chart = timelineHelper();

    var svg = d3.select("#timeline1").append("svg").attr("width", 500)
  .datum(rectAndCircleTestData).call(chart);


    //i should have rects with ids a1 and a2.  edit these and see what happens
    var doc = d3.select("#a1");

}

export default drawTimeline;