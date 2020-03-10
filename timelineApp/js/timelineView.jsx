import React from 'react';
import fetch from 'isomorphic-fetch';
//import PropTypes from 'prop-types';
import Documents from './document';
import UpperTimeline from './upperTimeline';
import LowerTimeline from './lowerTimeline';

export default class TimelineView extends React.Component {
	constructor(props) {
		//initialize mutable state
		super(props);
		this.state = { 
		  timelines: [],
		};
	}

	componentDidMount() {
		//this line automatically assigns this.props.url to the const variable url
		const { url } = this.props;

		//call rest api to get number of likes
		fetch(url, { credentials: 'same-origin' })
		  .then((response) => {
		  	if (!response.ok) throw Error(response.statusText);
		  	return response.json();
		  })
		  .then((data) => {
		  	this.setState({
		  		timelines: ["upperTimeline", "lowerTimeline"],
		  	});
		  })
		  .catch((error) => console.log(error));

	}

	render() {
   	  return (
        <div className="TimelineView">
          <UpperTimeline url={this.props.url} />
          <Documents url={this.props.url} />
          <LowerTimeline url={this.props.url} />
        </div>
      );
    }

}
