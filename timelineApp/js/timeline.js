import React from 'react';

//  **** UNSURE IF BELOW IMPORT OF ALL OF D3 IS NEEDED *********
import * as d3 from 'd3';

//import './drawLines.js';   --> Alex's work
import timeline from '../static/d3-timeline.js';
//import '../static/css/style.css';
//import timelines from '../static/d3-timeline-2.js';

//data viz gets data from props passed down from referenceView.jsx (parent)

//set up width and height and colors for timeline

var isUpper = true;


//***** NOTE: NEED ASSOCIATION BETWEEN DATES ON TIMELINE AND DOCUMENTS ******


//get dates associated with particular question for all docs in a story, from the /api/stories/3/ api
//return array of dates, EACH ASSOCIATED WITH A DOC
function gatherDatesFromJSON(question, ss) {

}


//title is like the question i.e. When Occurred that this timeline is covering
function setTimelineWithDates(title, isUpper) {
  //use d3 to call scaleLinear in here for the dates?

  var dates = gatherDatesFromJSON();
}

//draw lines from dates on timeline to corresponding document
function drawLines() {

}


const Timeline = ({viewName, clusterBy, dataUrl, data, documents, question, isUpper}) => {

  //setTimelineWithDates(question, isUpper, );
  //drawLines();

  //map data we have in the data parameter from react stuff to be suitable with d3 math

  //example of retrieving data and using it here
  //{data.map(doc =>
            //<img src={"/static/images/".concat('', doc.Frontcover)} alt="Picture of Document" height="200" width="150"></img>
          //)}
  console.log("atop Timeline function in timeline.js");

  //TODO:
  // EDIT THIS. GET MVP FIRST TO SEE IF IT WORKS.  HERE IS ALL THE D3 STUFF. FOLLOW GITHUB PAGE

/*
  var testData = [
  {label: "person a", times: [
    {"starting_time": 1355752800000, "ending_time": 1355759900000},
    {"starting_time": 1355767900000, "ending_time": 1355774400000}]},
  {label: "person b", times: [
    {"starting_time": 1355759910000, "ending_time": 1355761900000}]},
  {label: "person c", times: [
    {"starting_time": 1355761910000, "ending_time": 1355763910000}]}
  ];

  var chart = d3.timeline();

var svg = d3.select("#timeline1").append("svg").attr("width", 500)
  .datum(testData).call(chart);
  */

  /*
  var testData2 = [
    { times: [{ "starting_time": 1355752800000, "ending_time": 1355759900000 }, { "starting_time": 1355767900000, "ending_time": 1355774400000 }] },
    { times: [{ "starting_time": 1355759910000, "ending_time": 1355761900000 },] },
    { times: [{ "starting_time": 1355761910000, "ending_time": 1355763910000 }] }
  ];



  var width = 500;
  var height = 1000;

  function getXPos(d, i) {
    return d * 50;
  }

  function displayRects(data, color) {
    var svg = d3.select("#timeline").select("svg");
    var rects = svg.selectAll("rect").data(data);

    //enter phase  --> create dom elements from data elems and give these elem their permanent characteristics that wont be updated later
    rects.enter().append("rect")
      .attr("x", getXPos)
      .attr("y", 75)
      .attr("width", 20)
      .attr("height", 30)
      .attr("fill", color);
  }

  function displayLines(data) {
    var svg = d3.select("#timeline").select("svg")
    var lines = svg.selectAll("lines").data(data);

    lines.enter().append("line")          // attach a line
      .style("stroke", "black")  // colour the line
      .attr("x1", getXPos)     // x position of the first end of the line
      .attr("y1", 40)      // y position of the first end of the line
      .attr("x2", getXPos)     // x position of the second end of the line
      .attr("y2", 75);
  }

  function setUp() {
    var svg = d3.select("#timeline") // select the 'body' element
      .append("svg")           // append an SVG element to the body
        .attr("width", width)      // make the SVG element 449 pixels wide
        .attr("height", height);
  }

  function timelineTop() {
    var chart = timelines()
      .tickFormat( //
      {
        format: d3.time.format("%I %p"),
        tickTime: d3.time.hours,
        tickInterval: 1,
        tickSize: 10
      })
      .orient("top")
      .itemHeight(10)
      .display("circle"); // toggle between rectangles and circles

    var svg = d3.select("#timeline").select("svg")
      .datum(testData).call(chart);
  }

  function timelineBottom() {
    var chart = timelines()
      .tickFormat( //
      {
        format: d3.time.format("%I %p"),
        tickTime: d3.time.hours,
        tickInterval: 1,
        tickSize: 10
      })
      .orient("top")
      .itemHeight(10)
      .display("circle"); // toggle between rectangles and circles

    var svg = d3.select("#timeline").select("svg")
      .datum(testData2).call(chart);
  }

  setUp();
  timelineTop();
  timelineBottom();
  displayRects([1, 3, 5, 7, 9], "blue");
  displayLines([1, 3, 5, 7, 9]);
  */
  if (isUpper == true)
  {
    return (<p>Upper Timeline - {question}</p>)
  }
  else
  {
    var customStyle = {
      position: "relative",
      bottom: "10000px"
    }
    return (<p className="timelineBottom"> Lower Timeline - {question}</p>)
  }

};

export default Timeline;