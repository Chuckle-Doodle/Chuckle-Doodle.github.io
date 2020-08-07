import React from 'react';
import fetch from 'isomorphic-fetch';
import Documents from './documents.jsx';
//import ReferenceView from './referenceView';
import ReferenceViewOptions from './referenceViewOptions';
import domtoimage from 'dom-to-image';
import '../static/css/style.css';

export default class DataVisualization extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
		  viewInfo: {
		  	'ReferenceViews': []
		  },
		  data: null,
		  storyName: "",
		};
		this.exportAsJpeg = this.exportAsJpeg.bind(this);
	}

	componentDidMount() {
		//this line automatically assigns this.props.url to the const variable url
		const { dataUrl } = this.props;
		const { viewsUrl } = this.props;

		Promise.all([fetch(dataUrl), fetch(viewsUrl)])

			.then(([response1, response2]) => {
				return Promise.all([response1.json(), response2.json()])
			})
			.then(([response1, response2]) => {
				//logic capture data from the View that is "Active"
				var activeView = {}
				for (let i = 0; i < response2.Views.length; i++) {
					if (response2.Views[i]['Active'] == true) {
						activeView = response2.Views[i];
						break;
					} 
				}
				//by now activeView should be correctly set
				//console.log("printing active view");
				//console.log(activeView);

				this.setState({
					data: response1.Documents,
					storyName: response1.Story,  //something like storyName probably doesn't have to be in state considering it doesn't really change
		  			viewInfo: activeView,
		  		});
			});
	}

	exportAsJpeg() {
		console.log("in export as jpeg function");
		var node = document.getElementById('DataVisualization');

		domtoimage.toJpeg(node, { bgcolor: 'white' })
    		.then (function (dataUrl) {
    			console.log(dataUrl);
        		var link = document.createElement('a');
        		link.download = 'my-image-name.jpeg';
        		link.href = dataUrl;
        		link.click();
    		});
    		//.catch(function (error) {
        	//console.error('oops, something went wrong!', error);
    		//});
	}

	render() {

		//prevent render before data is filled up from fetch calls
		if (!this.state.data || !this.state.viewInfo) {
        	return <div />
        }
        //console.log("printing shit in datavis");
        //console.log(this.state.data);
        //console.log(this.state.viewInfo);

        //for use in map legend logic
        var answersPerCluster = {};
        var clusterNumbers = {};
        var currentClusterNumber = 0;

        for (let i = 1; i < this.state.viewInfo['ClusterByOptions'].length; i++) {  //start at i=1 because i=0 is doc ID
        	//initialize data structure
        	answersPerCluster[this.state.viewInfo['ClusterByOptions'][i]] = {};
        	var idx = this.state.data[0]['FormDataQuestions'].indexOf(this.state.viewInfo['ClusterByOptions'][i]);
        	for (let j = 0; j < this.state.data.length; j++) {
        		if (this.state.data[j]['FormDataAnswers'][idx] in answersPerCluster[this.state.viewInfo['ClusterByOptions'][i]]) {
					answersPerCluster[this.state.viewInfo['ClusterByOptions'][i]][this.state.data[j]['FormDataAnswers'][idx]].push(this.state.data[j]['docID']);
        		} else {
        			answersPerCluster[this.state.viewInfo['ClusterByOptions'][i]][this.state.data[j]['FormDataAnswers'][idx]] = [];
        			//keep track of what number cluster this is:
        			clusterNumbers[this.state.data[j]['FormDataAnswers'][idx]] = currentClusterNumber;
        			currentClusterNumber += 1;
        			answersPerCluster[this.state.viewInfo['ClusterByOptions'][i]][this.state.data[j]['FormDataAnswers'][idx]].push(this.state.data[j]['docID']); //docID
        		}
        		//answersPerCluster[this.state.viewInfo['ClusterByOptions'][i]].push(this.state.data[j]['FormDataAnswers'][idx]);
        	}
        	currentClusterNumber = 0;
        }
        //console.log("answersCluster");
        //console.log(answersPerCluster);
        //console.log(clusterNumbers);
        
        //determine order of reference views for use in later components' rendering
        //Pass this as a prop to each reference view, so each ref view knows the type of ALL ref views
        // ex/ ['Timeline', 'Timeline'] or ['Map', 'Timeline']
        var referenceViewOrder = [];
        for (let i = 0; i < this.state.viewInfo['ReferenceViews'].length; i++) {
        	referenceViewOrder.push(this.state.viewInfo['ReferenceViews'][i]['Type']);
        }

       	//WORKAROUND BELOW
	  	//if map then timeline, reverse order so rendering works
	  	var mapThenTimelineCase = false;
	  	if (referenceViewOrder[0] == "Map" && referenceViewOrder[1] == "Timeline")
	  	{
	  		//switch them
	  		referenceViewOrder[0] = "Timeline";
	  		referenceViewOrder[1] = "Map";
	  		mapThenTimelineCase = true;
	  	}

	  	//console.log(this.state.viewInfo.ReferenceViews);
	  	//this.state.viewInfo.ReferenceViews.reverse();


        //var colors = ["blue", "gray", "green", "red", "orange", "brown", "purple"];

		var documentsArray = [];
		var docImages = [];
	  	var index = 1;
	  	for (let i = 0; i < this.state.data.length; i++) {

	  		var doc = {};
	  		doc["Frontcover"] = this.state.data[i].Frontcover;
	  		doc["Questions"] = this.state.data[i].FormDataQuestions;
	  		doc["Answers"] = this.state.data[i].FormDataAnswers;
	  		doc["Filename"] = this.state.data[i].Filename;
	  		doc["docID"] = i + 1;
	  		documentsArray.push(doc);

	  		docImages.push([this.state.data[i].Frontcover, i + 1]);
	  	}

	  	//keep track of this only because it affects where to render Reference View Title
	  	var allMaps = true;
	  	for (let i = 0; i < referenceViewOrder.length; i++) {
	  		if (referenceViewOrder[i] != "Map")
	  		{
	  			allMaps = false;
	  			break;
	  		}
	  	}	

   	  return (
        <div id="DataVisualization">

          <div id="timelineHeading">

            <h3 id="timelineTitle">
          	  Timeline for {this.state.storyName}
          	</h3>

          	<h3 id="timelineSubTitle">
          	  View: {this.state.viewInfo.Name}
          	</h3>

          	<div id="timelineBackLink">
        	  <a href={"/" + this.props.storyid + "/1/"} >Return to PDF form page</a>
      		</div>

      		<div id="timelineLogoutLink">
      		  <a href={"/logout/"} >Logout</a>
      		</div>

          </div>

          <div>
        	<div id="customizeYourOptions">
        		<a href={"/" + this.props.storyid + "/views/"}> Customize your options </a>
        	</div>
        	<button id="exportAsJpeg" type="button" onClick={this.exportAsJpeg}>
        		Export page as .jpeg file
        	</button>
    	  </div>

          <ReferenceViewOptions ReferenceViews={mapThenTimelineCase ? this.state.viewInfo.ReferenceViews.reverse() : this.state.viewInfo.ReferenceViews} answersPerCluster={answersPerCluster} clusterNumbers={clusterNumbers} docImages={docImages} documents={documentsArray} data={this.state.data} clusterByOptions={this.state.viewInfo.ClusterByOptions} viewName={this.state.viewInfo.Name} dataUrl={this.props.dataUrl} referenceViewOrder={referenceViewOrder} />


        </div>
      );
    }
}
		//below component used to be rendered in this module

        //<div id="DocumentsDiv">
          //<Documents data={this.state.data} docImages={docImages} clusterBy={this.state.viewInfo.ClusterBy} documents={documentsArray} />
        //</div>