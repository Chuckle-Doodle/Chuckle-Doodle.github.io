import React from 'react';
//import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
//import moment from 'moment';
//import Likes from './likes';
//import Comments from './comments';
import Timeline from './timeline.js';
import Map from './map.js';

export default class ReferenceView extends React.Component {
  constructor(props) {
    super(props);
    //this.state = {
      //data: [],
    //};

    //NOTE: IF THIS CLASS HAS NO STATE, IT CAN BE MADE A FUNCTIONAL COMPONENT INSTEAD

  }

  /*
  componentDidMount() {
    // Runs when an instance is added to the DOM
    // Call REST API to get data
    fetch(this.props.url, { credentials: 'same-origin' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        //this.setState({
          //data: data.Black_Death
        //});
      })
      .catch(error => console.log(error)); // eslint-disable-line no-console
  }
  */


  render() {

    //find out which type of ReferenceView we have, timeline or map
    const refViewType = this.props.type;
    var isUpper = true;

    return (
      <div className="ReferenceView">
        <div>

          {refViewType == "Timeline" ? (
              <Timeline viewName={this.props.viewName} clusterBy={this.props.clusterBy} dataUrl={this.props.dataUrl} data={this.props.data} documents={this.props.documents} question={this.props.question} isUpper={isUpper} />
            ) : (
              <Map viewName={this.props.viewName} clusterBy={this.props.clusterBy} dataUrl={this.props.dataUrl} data={this.props.data} documents={this.props.documents} question={this.props.question} isUpper={isUpper} />
            )
          }
        </div>

      </div>
    );
  }
}

        //<Likes url={`${this.props.url}likes/`} />
        //<Comments url={`${this.props.url}comments/`} />

            //<ul>
              //<svg height="50" width="1000">
                //<line x1="50" y1="50" x2="1000" y2="50"
                //stroke="black" />
              //</svg>

              //<svg>
                //<text x="20" y="35">1900</text>
                //<text x="100" y="35">1925</text>
                //<text x="180" y="35">1950</text>
                //<text x="260" y="35">1975</text>
              //</svg>
            //</ul>
