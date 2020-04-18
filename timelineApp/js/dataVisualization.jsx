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
				this.setState({
					data: response1.Documents,
					storyName: response1.Story,  //something like storyName probably doesn't have to be in state considering it doesn't really change
		  			viewInfo: response2.Views[0],
		  		});
			});
	}

	render() {
		//prevent render before data is filled up from fetch calls
		if (!this.state.data) {
        	return <div />
        }
        console.log(this.state.data);

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

          </div>

          <div>
            {this.state.viewInfo.ReferenceViews.map((view, index) =>
              <ReferenceView docImages={docImages} viewName={this.state.viewInfo.Name} clusterBy={this.state.viewInfo.ClusterBy} dataUrl={this.props.dataUrl} data={ this.state.data } documents={ documentsArray } type={ view.Type } question={ view.Question }
              isUpper={index == 0 ? true : false} />
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