import React from 'react';
import fetch from 'isomorphic-fetch';
//import PropTypes from 'prop-types';
import Documents from './documents.jsx';
//import Document from './documents';
import ReferenceView from './referenceView';
//import ClusterButton from './clusterButton.jsx';

export default class DataVisualization extends React.Component {
	constructor(props) {
		//initialize mutable state
		super(props);
		this.state = { 
		  viewInfo: {
		  	'ReferenceViews': []
		  },
		  data: null,
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
				console.log(response1.Black_Death);
				this.setState({
					data: response1.Black_Death,
		  			viewInfo: response2.Views[0],
		  		});
			});


		/*
		//call rest api on the views endpoint to get current views!
		fetch(viewsUrl, { credentials: 'same-origin' })
		  .then((response) => {
		  	if (!response.ok) throw Error(response.statusText);
		  	return response.json();
		  })
		  .then((data) => {
		  	//console.log(data.Views[0]);
		  	this.setState({
		  		viewInfo: data.Views[0],
		  	});
		  })
		  .catch((error) => console.log(error));


		//call rest api on data endpoint to get data
		fetch(dataUrl, { credentials: 'same-origin' })
		  .then((response) => {
		  	if (!response.ok) throw Error(response.statusText);
		  	return response.json();
		  })
		  .then((data) => {
		  	//console.log(data.Black_Death);
		  	this.setState({
		  		data: data.Black_Death,
		  	});
		  })
		  .catch((error) => console.log(error));
		  */


		// ********************* add on stuff to populate the documentsArray variable to then pass to ReferenceView component

		//TODO: DON"T DO THIS STUFF UNTIL DATA COMES IN AND STATE IS UPDATED !!!!!!!!

	}

	render() {
		//prevent render before data is filled up from fetch calls
		if (!this.state.data) {
        	return <div />
        }

	//TESTING:

	//pass this documents array to the ReferenceView component
	  //var documents = [];
	  //var index = 1;

	  //for (var i = 0; i < this.state.data.length; i++) {
	  	//console.log(this.state.data[i]);
	  	//var doc = {};
	  	//doc["Frontcover"] = this.state.data[i].Frontcover;
	  	//doc["Questions"] = this.state.data[i].FormDataQuestions;
	  	//doc["Answers"] = this.state.data[i].FormDataAnswers;
	  	//doc["Filename"] = this.state.data[i].Filename;
	  	//documents.push(doc);
	  //}

	  //console.log("hello there")    --> use these print statements to learn effect of putting this code here. rn it prints something interesting
	  //console.log(documents);


	  //console.log("00000000000");
	  //console.log(this.state.viewInfo);

	    //console.log("beginning of render func in dataVis.jsx");
    	//console.log(this.state.viewInfo.ClusterBy);
    	//console.log(this.state.documents);

		var documentsArray = [];
	  	var index = 1;
	  	for (let i = 0; i < this.state.data.length; i++) {
	  	//console.log(this.state.data[i]);
	  		var doc = {};
	  		doc["Frontcover"] = this.state.data[i].Frontcover;
	  		doc["Questions"] = this.state.data[i].FormDataQuestions;
	  		doc["Answers"] = this.state.data[i].FormDataAnswers;
	  		doc["Filename"] = this.state.data[i].Filename;
	  		doc["docID"] = i + 1;
	  		documentsArray.push(doc);
	  	}

	  	//console.log(this.state.documents);

   	  return (
        <div className="DataVisualization">


          <div>
            {this.state.viewInfo.ReferenceViews.map((view, index) =>
              <ReferenceView viewName={this.state.viewInfo.Name} clusterBy={this.state.viewInfo.ClusterBy} dataUrl={this.props.dataUrl} data={ this.state.data } documents={ documentsArray } type={ view.Type } question={ view.Question }
              isUpper={index == 0 ? true : false} />
            )}
          </div>


          <div>
            <Documents id="docs" data={this.state.data} clusterBy={this.state.viewInfo.ClusterBy} documents={documentsArray} />
          </div>


        </div>
      );
    }

}


          //<div>
            //{this.state.data.map((doc, index) =>
              //<Document image={doc.Frontcover} questions={doc.FormDataQuestions} answers={doc.FormDataAnswers} docID={index + 1} />

			  //<img src="/static/images/".concat('', doc.Frontcover) id={index + 1} alt="Picture of Document" height="200" width="150"></img>
            //)}

          //</div>