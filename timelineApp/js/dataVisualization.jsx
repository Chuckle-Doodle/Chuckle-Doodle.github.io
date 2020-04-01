import React from 'react';
import fetch from 'isomorphic-fetch';
import Documents from './documents.jsx';
import ReferenceView from './referenceView';

export default class DataVisualization extends React.Component {
	constructor(props) {
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
	}

	render() {
		//prevent render before data is filled up from fetch calls
		if (!this.state.data) {
        	return <div />
        }

        var blankImage = "https://images-wixmp-530a50041672c69d335ba4cf.wixmp.com/templates/image/b77fe464cfc445da9003a5383a3e1acf.jpg";
		var documentsArray = [];
		var docImages = [];
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

	  		docImages.push(this.state.data[i].Frontcover);
	  		docImages.push(blankImage); //add blankImages in between each doc
	  	}
	  	docImages.pop(); //get rid of last blankImage


   	  return (
        <div className="DataVisualization">

          <div>
            {this.state.viewInfo.ReferenceViews.map((view, index) =>
              <ReferenceView viewName={this.state.viewInfo.Name} clusterBy={this.state.viewInfo.ClusterBy} dataUrl={this.props.dataUrl} data={ this.state.data } documents={ documentsArray } type={ view.Type } question={ view.Question }
              isUpper={index == 0 ? true : false} />
            )}
          </div>

          <div>
            <Documents id="docs" data={this.state.data} docImages={docImages} clusterBy={this.state.viewInfo.ClusterBy} documents={documentsArray} />
          </div>

        </div>
      );
    }
}