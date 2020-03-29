import React from 'react';
//import { scaleOrdinal } from 'd3-scale';
import * as d3 from 'd3';  //can instead import specific modules instead of everything
//import './drawLines.js';   --> Alex's work

//data viz gets data from props passed down from referenceView.jsx (parent)

//set up width and height and colors for timeline

var isUpper = true;


//***** NOTE: NEED ASSOCIATION BETWEEN DATES ON TIMELINE AND DOCUMENTS ******


//get dates associated with particular question for all docs in a story, from the /api/stories/3/ api
//return array of dates, EACH ASSOCIATED WITH A DOC
function gatherDatesFromJSON(question, ) {

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

  setTimelineWithDates(question, isUpper, );
  drawLines();

  //map data we have in the data parameter from react stuff to be suitable with d3 math

  //example of retrieving data and using it here
  //{data.map(doc =>
            //<img src={"/static/images/".concat('', doc.Frontcover)} alt="Picture of Document" height="200" width="150"></img>
          //)}

  return (
    <div>
      This view is the: {viewName}

    </div>
  )

};

export default Timeline;