import React from 'react';
import fetch from 'isomorphic-fetch';
//import Documents from './documents.jsx';
import ReferenceView from './referenceView';
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
				console.log("printing active view");
				console.log(activeView);

				this.setState({
					data: response1.Documents,
					storyName: response1.Story,  //something like storyName probably doesn't have to be in state considering it doesn't really change
		  			viewInfo: activeView,
		  		});
			});
	}

	render() {

		//prevent render before data is filled up from fetch calls
		if (!this.state.data || !this.state.viewInfo) {
        	return <div />
        }
        
        //determine order of reference views for use in later components' rendering
        //Pass this as a prop to each reference view, so each ref view knows the type of ALL ref views
        // ex/ ['Timeline', 'Timeline'] or ['Map', 'Timeline']
        var referenceViewOrder = [];
        for (let i = 0; i < this.state.viewInfo['ReferenceViews'].length; i++) {
        	referenceViewOrder.push(this.state.viewInfo['ReferenceViews'][i]['Type']);
        }

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
        	  <a href={"/" + this.props.storyid + "/"} >Return to PDF form page</a>
      		</div>

      		<div id="timelineLogoutLink">
      		  <a href={"/logout/"} >Logout</a>
      		</div>

          </div>

          <div>
            {this.state.viewInfo.ReferenceViews.map((view, index) =>
            	<div>
            		<div className="ReferenceViewTitle">
            			{index == 0 ? (view.Type == "Timeline" ? ("Timeline of: " + view.Question) : ("Map of: " + view.Question)) : null}
            		</div>

            		<div className="ReferenceViewTitle">
						{index == 1 ? ((view.Type == "Map" && allMaps == false) ? ("Map of: " + view.Question) : null) : null}
            		</div>

            		<ReferenceView docImages={docImages} viewName={this.state.viewInfo.Name} clusterByOptions={this.state.viewInfo.ClusterByOptions} dataUrl={this.props.dataUrl} data={ this.state.data } documents={ documentsArray } type={ view.Type } question={ view.Question }
              		isUpper={index == 0 ? true : false} storyid={this.props.storyid} referenceViewOrder={referenceViewOrder} />
              		
              		<div className="ReferenceViewTitle">
						{index == 1 ? (view.Type == "Timeline" ? ("Timeline of: " + view.Question) : null) : null}
            		</div>
              	</div>
            )}
          </div>


        </div>
      );
    }
}
		//below component used to be rendered in this module

        //<div id="DocumentsDiv">
          //<Documents data={this.state.data} docImages={docImages} clusterBy={this.state.viewInfo.ClusterBy} documents={documentsArray} />
        //</div>